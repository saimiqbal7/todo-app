const storeFiles = require('../todo');


// Dummy data showing data structure
const dummyData = {
  user1: {
    publicKey: 'user1',
    todos: [
      { id: 'todo-1', todo: 'Buy milk', isDone: false },
      { id: 'todo-2', todo: 'Buy Choco', isDone: false },
    ],
  },
};

async function main() {
  console.log('Running test for todo.js');
  await storeFiles(dummyData);
}

main();