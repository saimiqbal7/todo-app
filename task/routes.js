const express = require('express');
const router = express.Router();
const db = require('./db_model');
const fs = require('fs');
const { namespaceWrapper } = require('./namespaceWrapper');

// Middleware to log incoming requests
router.use((req, res, next) => {
  console.log(`Incoming ${req.method} request to ${req.originalUrl}`);
  next();
});

router.get('/taskState', async (req, res) => {
  const state = await namespaceWrapper.getTaskState();
  console.log('TASK STATE', state);

  res.status(200).json({ taskState: state });
});

// API to register the todo
router.post('/todo', async (req, res) => {
  const todo = req.body.payload;
  // Check req.body
  if (!todo) {
    res.status(400).json({ error: 'Invalid request' });
    return;
  } else {
    console.log(todo);
  }

  // Use the code below to sign the data payload
  let signature = todo.signature;
  let pubkey = todo.publicKey;

  let proof = {
    publicKey: pubkey,
    signature: signature,
  };
  console.log('Check Proof:', proof);
  // use fs to write the todo and proof to a file
  if (!fs.existsSync('./Todo')) fs.mkdirSync('./Todo');
  fs.writeFileSync(
    './Todo/' + `todo_${pubkey}.json`,
    JSON.stringify(todo),
  );
  // fs.writeFileSync('proof.json', JSON.stringify(proof));
  await db.setTodo(pubkey, todo);

  const round = await namespaceWrapper.getRound();
  // TEST For only testing purposes:
  // const round = 1000

  let proofs = await db.getProofs(pubkey);
  proofs = JSON.parse(proofs || '[]');
  proofs.push(proof);
  console.log(`${pubkey} Proofs: `, proofs);
  await db.setProofs(pubkey, proofs);

  return res
    .status(200)
    .send({ message: 'Proof and todo registered successfully' });
});

router.get('/logs', async (req, res) => {
  const logs = fs.readFileSync('./namespace/logs.txt', 'utf8');
  res.status(200).send(logs);
});
// endpoint for specific todo data by publicKey
router.get('/todo/get', async (req, res) => {
  const log = 'Nothing to see here, check /:publicKey to get the todo';
  return res.status(200).send(log);
});
router.get('/todo/get/:publicKey', async (req, res) => {
  const { publicKey } = req.params;
  let todo = await db.getTodo(publicKey);
  todo = todo || '[]';
  return res.status(200).send(todo);
});

router.get('/todo/all', async (req, res) => {
  todo = (await db.getAllTodos()) || '[]';
  return res.status(200).send(todo);
});

router.get('/todo/list', async (req, res) => {
  todo = (await db.getAllTodos(true)) || '[]';
  return res.status(200).send(todo);
});
router.get('/proofs/all', async (req, res) => {
  todo = (await db.getAllProofs()) || '[]';
  return res.status(200).send(todo);
});
router.get('/proofs/get/:publicKey', async (req, res) => {
  const { publicKey } = req.params;
  let proof = await db.getProofs(publicKey);
  proof = proof || '[]';
  return res.status(200).send(proof);
});
router.get('/node-proof/all', async (req, res) => {
  todo = (await db.getAllNodeProofCids()) || '[]';
  return res.status(200).send(todo);
});
router.get('/node-proof/:round', async (req, res) => {
  const { round } = req.params;
  let nodeproof = (await db.getNodeProofCid(round)) || '[]';
  return res.status(200).send(nodeproof);
});
router.get('/authlist/get/:publicKey', async (req, res) => {
  const { publicKey } = req.params;
  let authlist = await db.getAuthList(publicKey);
  authlist = authlist || '[]';
  return res.status(200).send(authlist);
});
router.get('/authlist/list', async (req, res) => {
  authlist = (await db.getAllAuthLists(false)) || '[]';
  authlist.forEach(authuser => {
    authuser = authuser.toString().split('auth_list:')[0];
  });
  return res.status(200).send(authlist);
});
router.post('/authlist', async (req, res) => {
  const pubkey = req.body.authdata.pubkey;
  // console.log("AUTHLIST", pubkey);
  await db.setAuthList(pubkey);
  return res.status(200).send(pubkey);
});
router.get('/nodeurl', async (req, res) => {
  const nodeUrlList = await namespaceWrapper.getNodes();
  return res.status(200).send(nodeUrlList);
});
// router.post('/register-authlist', async (req, res) => {
//   const pubkey = req.body.pubkey;
//   await db.setAuthList(pubkey);
//   return res.status(200).send({message: 'Authlist registered successfully'});
// }
// )

module.exports = router;
