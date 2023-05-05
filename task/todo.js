const fs = require('fs');
const { Web3Storage, getFilesFromPath, File } = require('web3.storage');
const storageClient = new Web3Storage({
  token: 'your-api-key',
});

async function storeFiles(path) {
  const files = await getFilesFromPath(path);
  console.log(`read ${files.length} file(s) from ${path}`);
  const client = storageClient;
  const cid = await client.put(files);
  console.log('stored files with cid:', cid);
  return cid;
}

const filePath = './data.json';
storeFiles(filePath)
  .then((cid) => console.log(`Data stored with CID ${cid}`))
  .catch((error) => console.error('Error storing data:', error));
