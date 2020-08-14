const express = require('express');
const router = express.Router();
const db = require('../todolist/queries.js');

router.get('/', db.getTodos);
router.get('/:id', db.getTodoById);
router.post('/', db.createTodo);
router.put('/new/:id', db.updateTodo);
router.put('/:id', db.toggleTodo);
router.delete('/:id', db.deleteTodo);

module.exports = router;
