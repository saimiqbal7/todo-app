const coreLogic = require('./coreLogic');
const dbSharing = require('./dbSharing');
// const localShim = require("./localTestingShim"); // TEST to enable testing with K2 without round timers, enable this line and line 59
const { app, MAIN_ACCOUNT_PUBKEY, SERVICE_URL, TASK_ID } = require('./init');
const express = require('express');
const {
  namespaceWrapper,
  taskNodeAdministered,
} = require('./namespaceWrapper');
const { default: axios } = require('axios');
const bs58 = require('bs58');
const solanaWeb3 = require('@solana/web3.js');
const nacl = require('tweetnacl');
const fs = require('fs');
const db = require('./db_model');
const routes = require('./routes');
const path = require('path');

async function setup() {
  const originalConsoleLog = console.log;
  const logDir = './namespace';
  const logFile = 'logs.txt';
  const maxLogAgeInDays = 3;

  console.log('setup function called');
  // Check if the log directory exists, if not, create it
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }
  // Create a writable stream to the log file
  const logPath = path.join(logDir, logFile);
  const logStream = fs.createWriteStream(logPath, { flags: 'a' });

  // Function to remove logs older than specified age (in 3 days)
  async function cleanOldLogs(logDir, logFile, maxLogAgeInDays) {
    const currentDate = new Date();
    const logPath = path.join(logDir, logFile);

    if (fs.existsSync(logPath)) {
      const fileStats = fs.statSync(logPath);
      const fileAgeInDays =
        (currentDate - fileStats.mtime) / (1000 * 60 * 60 * 24);

      if (fileAgeInDays > maxLogAgeInDays) {
        fs.unlinkSync(logPath);
      }
    }
  }

  // Overwrite the console.log function to write to the log file
  console.log = function (...args) {
    originalConsoleLog.apply(console, args);
    const message =
      args
        .map(arg => (typeof arg === 'object' ? JSON.stringify(arg) : arg))
        .join(' ') + '\n';

    // Write the message to the log file
    logStream.write(message);
  };
  // Clean old logs
  await cleanOldLogs(logDir, logFile, maxLogAgeInDays);
  // Run default setup
  await namespaceWrapper.defaultTaskSetup();
  process.on('message', m => {
    console.log('CHILD got message:', m);
    if (m.functionCall == 'submitPayload') {
      console.log('submitPayload called');
      coreLogic.submitTask(m.roundNumber);
    } else if (m.functionCall == 'auditPayload') {
      console.log('auditPayload called');
      coreLogic.auditTask(m.roundNumber);
    } else if (m.functionCall == 'executeTask') {
      console.log('executeTask called');
      coreLogic.task();
    } else if (m.functionCall == 'generateAndSubmitDistributionList') {
      console.log('generateAndSubmitDistributionList called');
      coreLogic.submitDistributionList(m.roundNumber);
    } else if (m.functionCall == 'distributionListAudit') {
      console.log('distributionListAudit called');
      coreLogic.auditDistribution(m.roundNumber);
    }
  });

  // Code for the data replication among the nodes
  setInterval(() => {
    dbSharing.share();
  }, 20000);
}

if (taskNodeAdministered) {
  setup();
}
if (app) {
  app.use(express.json());
  app.use('/', routes);
}
