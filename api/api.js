require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('./middleware/logger');
const todoRoutes = require('./routes/todos');
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

app.use(
	bodyParser.urlencoded({
		extended: true
	})
);

app.use(bodyParser.json());

const logWrapper = (req, res, next) => {
	return logger.logger(req, res, next, logs);
};

app.use(logWrapper);

app.use('/api/todos', todoRoutes);
app.use('/api/mail', mailRoutes);
// app.set('json spaces', 2);
app.set('view options', { pretty: true });
app.get('/api/', (req, res, next) => {
	res.status(200).json({
		title: 'abarbieux.com REST API',
		todoListCommands: {
			prefix: '/api/',
			getTodos: 'get /todos',
			getTodoById: 'get /todos/:id',
			createTodo: 'post /todos/?title=title&complete=checked',
			updateTodo: 'put /todos/:id',
			deleteTodo: 'delete /todos/:id'
		},
		mailCommands: {
			sendMail: 'post /mail/?replyto=theirEmail&name=theirName&subject=&content=whatTheyTyped'
		}
	});
});

module.exports = app;
