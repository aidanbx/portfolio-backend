require('dotenv').config({ path: '../' });
const express = require('express');
// const path = require('path');

const bodyParser = require('body-parser');
const logger = require('./middleware/logger');
const todoRoutes = require('./routes/todos');
const app = express();

app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', [ '*' ]);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(
  bodyParser.urlencoded({
    extended : true,
  })
);

app.use(bodyParser.json());

app.use(logger);

app.use('/api/todos', todoRoutes);

// app.use('/*', (req, res, next) => {
//   res.set({
//     'Content-Type'                 : 'text/json',
//     'Access-Control-Allow-Origin'  : '*',
//     'Access-Control-Allow-Headers' :
//       'Origin, X-Requested-With, Content-Type, Accept',
//     'Access-Control-Allow-Methods' : 'GET, POST, OPTIONS, PUT, DELETE',
//   });
//   next();
// });

app.get('/', (req, res, next) => {
  res.status(400).json({
    err : 'API calls must be in the form /api/<path>',
  });
  return;
});

app.get('/api/', (req, res, next) => {
  res.send(
    JSON.stringify(
      {
        info     : 'Todolist API',
        commands : {
          getTodos    : 'get /todos',
          getTodoById : 'get /todos/:id',
          createTodo  : 'post /todos',
          updateTodo  : 'put /todos/:id',
          deleteTodo  : 'delete /todos/:id',
        },
      },
      null,
      2
    )
  );
});

module.exports = app;
