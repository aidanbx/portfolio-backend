require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('./middleware/logger');
const notesRoutes = require('./routes/notes');
const mailRoutes = require('./routes/mail');
const logs = require('../logs.json');
const app = express();
const PORT = process.env.PORT || 8080;
const IP = process.env.IP || 'localhost';

app.set('PORT', PORT);
app.set('IP', IP);

app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', [ '*' ]);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append('Access-Control-Allow-Headers', 'Content-Type');

  next();
});

//! redirect
app.use('/*', (req, res, next) => {
  const log = logger.makeLog(req);
  if (log.domain === 'abarbieux.com' || log.domain === 'www.abarbieux.com') {
    res.redirect(301, 'https://barbieux.dev' + log.url);
  }
  next();
});

app.use(
  bodyParser.urlencoded({
    extended : true,
  })
);

app.use(bodyParser.json({ limit: '500mb' }));

const logWrapper = (req, res, next) => {
  return logger.logger(req, res, next, logs);
};

app.use(logWrapper);

app.use('/api/notes', notesRoutes);
app.use('/api/mail', mailRoutes);
// app.set('json spaces', 2);
app.set('view options', { pretty: true });
app.get('/api/', (req, res, next) => {
  res.header('Content-Type', 'application/json');
  res.status(200).send(
    JSON.stringify(
      {
        title            : 'barbieux.dev REST API',
        todoListCommands : {
          prefix : '/api/',
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
