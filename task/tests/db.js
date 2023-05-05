const dbmodel = require('../db_model');

const PublicKey = 'test-pubkeynonon0';
const PublicKey2 = 'test-pubkey2';

async function testdb() {
  const round = 1000;
  const pubkey = PublicKey;

  let todo = 'Buy milk and bread';

  let todo2 = 'Drink water';


  // await dbmodel.setTodo(PublicKey, todo);
  // await dbmodel.setTodo(PublicKey, todo2);
  await dbmodel.updateTodo(PublicKey, 'bafybeico5yp6yn4jn4hddnzg2jvrvsupfrua6iqgo2jaxpp7bckpqspdnq');

  // get todo
  // let todo_ = await dbmodel.getTodo(PublicKey);
  // console.log(todo_);

  // get all todos
  let all = await dbmodel.getAllTodos();
  console.log(all);
}

testdb();
