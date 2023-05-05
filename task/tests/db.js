const dbmodel = require('../db_model');

const PublicKey = 'test-pubkeynonon0';
const PublicKey2 = 'test-pubkey2';

async function testdb() {
  const round = 1000;
  const pubkey = PublicKey;

  let todo = {
    todos: [
      { id: 'to-1', todo: 'Buy milk and bread', isDone: true },
      { id: 'todo-4', todo: 'Buy Choco and fruits', isDone: false },
    ],
  };
  let todo2 = {
    todos: [
      { id: 'todo-8', todo: 'Drink water', isDone: false },
      { id: 'todo-2', todo: 'Buy Choco', isDone: false },
    ],
  };
  // await dbmodel.setTodo(PublicKey, todo);
  await dbmodel.setTodo(PublicKey, todo2);

  // get todo
  let todo_ = await dbmodel.getTodo(PublicKey);
  console.log(todo_);

  // get all todos
  let all = await dbmodel.getAllTodos();
  console.log(all);
}

testdb();
