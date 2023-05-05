const { namespaceWrapper } = require('./namespaceWrapper');
const storeFiles = require('./todo');

// db functions todo
const getTodo = async publicKey => {
  console.log('Todo get');

  return new Promise((resolve, reject) => {
    namespaceWrapper.levelDB.get(getTodoId(publicKey), (err, value) => {
      if (err) {
        console.error('Error in getTodo:', err);
        resolve(null);
      } else {
        resolve(JSON.parse(value || '[]'));
      }
    });
  });
};

const setTodo = async (publicKey, todo) => {
  const todoCID = await storeFiles(todo);
  const prevTodos = await getTodo(publicKey);

  if (prevTodos === null) {
    namespaceWrapper.levelDB.put(
      getTodoId(publicKey),
      JSON.stringify([todoCID]),
    );
    return console.log('New todo set');
  } else if (prevTodos !== null) {
    prevTodos.push(todoCID);
    namespaceWrapper.levelDB.put(
      getTodoId(publicKey),
      JSON.stringify(prevTodos),
    );
    return console.log('Todo Updated');
  }
};

const getAllTodos = async values => {
  return new Promise((resolve, reject) => {
    let dataStore = [];

    if (!values) values = true;
    namespaceWrapper.levelDB
      .createReadStream({
        lt: 'todo~',
        gt: `todo`,
        reverse: true,
        keys: true,
        values: values,
      })
      .on('data', function (data) {
        console.log(data.key.toString(), '=', data.value.toString());
        dataStore.push({
          key: data.key.toString(),
          value: JSON.parse(data.value.toString()),
        });
      })
      .on('error', function (err) {
        console.log('Something went wrong in read todosStream!', err);
        reject(err);
      })
      .on('close', function () {
        console.log('Stream closed');
      })
      .on('end', function () {
        console.log('Stream ended');
        resolve(dataStore);
      });
  });
};

const getTodoId = publicKey => {
  return `todo:${publicKey}`;
};

module.exports = {
  getTodo,
  setTodo,
  getAllTodos,
};
