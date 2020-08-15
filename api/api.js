require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('./middleware/logger');
const todoRoutes = require('./routes/todos');
const mailRoutes = require('./routes/mail');
const app = express();
const PORT = process.env.PORT || 8080;
const IP = process.env.IP || localhost;

app.set('PORT', PORT);
app.set('IP', IP);

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

app.use(logger.logger);

app.use('/api/todos', todoRoutes);
app.use('/api/mail', mailRoutes);

app.get('/api/', (req, res, next) => {
  res.send(
    JSON.stringify(
      {
        title            : 'abarbieux.com REST API',
        todoListCommands : {
          prefix      : '/api/',
          getTodos    : 'get /todos',
          getTodoById : 'get /todos/:id',
          createTodo  : 'post /todos/?title=title&complete=checked',
          updateTodo  : 'put /todos/:id',
          deleteTodo  : 'delete /todos/:id',
        },
        mailCommands     : {
          sendMail :
            'post /mail/?replyto=theirEmail&name=theirName&subject=&content=whatTheyTyped',
        },
      },
      null,
      2
    )
  );
});

module.exports = app;
