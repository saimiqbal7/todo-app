const fs = require('fs');
const { Web3Storage, getFilesFromPath, File, Blob } = require('web3.storage');
const storageClient = new Web3Storage({
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDNhMzJGMjdGZUFENTU0RGRDRDAyRGVFRTZmNzcyRjQxN0MzYzdkMTUiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2ODMyOTU4MTQ0MjcsIm5hbWUiOiJrb2lpLXRvZG8ifQ.Pp2ziiA4h5QcSVLLwA7am4vAQdUor6ad3qe2M3_0N8k',
});

async function storeFiles(data_object) {
  const buffer = Buffer.from(JSON.stringify(data_object));
  const files = [new File([buffer], 'data.json')];
  const cid = await storageClient.put(files);
  console.log('stored files with cid:', cid);
  return cid;
}

module.exports = storeFiles;
