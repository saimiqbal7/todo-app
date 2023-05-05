const fs = require('fs');
const { Web3Storage, getFilesFromPath, File } = require('web3.storage');
const storageClient = new Web3Storage({
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDJkMEEzMjVENUMwNUEzNkQyNzA4NmJhYWM1NDBiYkM0OTllNzVhNDgiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2ODMyODQ1MzI5OTgsIm5hbWUiOiJ0b2RvIn0.YH3LgkQ9GUId9HWPtePi9v9tLIj2fFddsx2NOdsQ_L8',
});

// async function storeFiles(path) {
//   const files = await getFilesFromPath(path);
//   console.log(`read ${files.length} file(s) from ${path}`);
//   const client = storageClient;
//   const cid = await client.put(files);
//   console.log('stored files with cid:', cid);
//   return cid;
// }

// const filePath = './data.json';
// storeFiles(filePath)
//   .then(cid => console.log(`Data stored with CID ${cid}`))
//   .catch(error => console.error('Error storing data:', error));

 async function storeFiles(data_object) {
  const data = JSON.stringify(data_object);
  fs.writeFileSync('todo.json', data);

  if (storageClient) {
    // check if storage client for Web3Storage is defined
    // Storing on IPFS through web3 storage
    const file = await getFilesFromPath('./todo.json'); // fetch file
    const cid = await storageClient.put(file); // upload file
    console.log('CID of Uploaded Data: ', cid);
    await retrieve(cid);
  } else {
    console.error('No web3 storage API key provided');
  }
}

async function retrieve(cid) {
  const res = await storageClient.get(cid);
  console.log(`Got a response! [${resstatus}] ${res.statusText}`);
  if (!res.ok) {
    throw new Error(`failed to get ${cid}`);
  }
}



module.exports = storeFiles