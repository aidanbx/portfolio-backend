const express = require('express');
const router = express.Router();
const db = require('../notes/queries.js');

router.get('/', db.getNotes);
router.get('/:id', db.getNoteById);
router.post('/', db.createNote);
router.put('/:id', db.updateNote);
router.delete('/:id', db.deleteNote);

module.exports = router;
