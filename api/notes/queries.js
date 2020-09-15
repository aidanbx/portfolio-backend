require('dotenv').config({ path: '../' });
const moment = require('moment');
const { Pool } = require('pg');

const pool = new Pool();

const notesTable = process.env.NOTE_TABLE || 'notes';

// GET /api/notes gets all notes in db
const getNotes = (req, res) => {
  pool.query(`SELECT * FROM ${notesTable} ORDER BY date ASC`, (err, result) => {
    if (err) {
      res.status(500).json({
        msg : '500 Database Down Error',
        err : { name: err.name, message: err.message },
      });
      return;
    }
    res.status(200).json(result.rows);
  });
};

// GET /api/notes/:id gets note with id :id
const getNoteById = (req, res) => {
  const id = parseInt(req.params.id);

  if (Number.isNaN(id)) {
    res.status(400).json({ err: 'BAD REQUEST: id must be an int' });
    return;
  } else {
    pool.query(
      `SELECT * FROM ${notesTable} WHERE id = ($1)`,
      [ id ],
      (err, result) => {
        if (err) {
          res.status(500).json({
            msg : 'Database Error',
            err : { name: err.name, message: err.message },
          });
          return;
        }
        res.status(200).json(result.rows[0]);
        next();
      }
    );
  }
};

// POST /api/Notes title=random title&complete=false
const createNote = (req, res) => {
  let { title, content, date, archived, expanded } = req.body;
  title = title || 'No Title';
  content = content || 'No Content';
  date = date || moment().unix();
  archived = archived || false;
  expanded = expanded || false;
  console.log('creating ', title, content);
  pool.query(
    `INSERT INTO ${notesTable} ( title, content, date, archived, expanded ) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [ title, content, date, archived, expanded ],
    (err, result) => {
      if (err) {
        res.status(500).json({
          msg : '500 Database Error',
          err : { name: err.name, message: err.message },
        });
        return;
      }

      res.status(201).json(result.rows[0]);
    }
  );
};

// DELETE /api/Notes/:id
const deleteNote = (req, res) => {
  const id = parseInt(req.params.id);

  if (Number.isNaN(id)) {
    res.status(400).json({ err: 'BAD REQUEST: id must be an int' });
    return;
  } else {
    pool.query(
      `DELETE FROM ${notesTable} WHERE id = ($1)`,
      [ id ],
      (err, result) => {
        if (err) {
          res.status(500).json({
            msg : '500 Database Error',
            err : { name: err.name, message: err.message },
          });
        }

        res.status(200).json({
          msg : `note deleted with id ${id}`,
          id  : id,
        });
      }
    );
  }
};

// PUT /api/notes/new/:id -d 'title=new title'
const updateNote = (req, res) => {
  const id = parseInt(req.params.id);
  let oldNote;
  let { title, content, date, archived, expanded } = req.body;

  if (Number.isNaN(id)) {
    res.status(400).json({ err: 'BAD REQUEST: id must be an int' });
    return;
  } else {
    pool.query(
      `SELECT * FROM ${notesTable} WHERE id=$1`,
      [ id ],
      (err, result) => {
        if (err) {
          res.status(500).json({
            msg : 'Database Error',
            err : { name: err.name, message: err.message },
          });
          return;
        }
        oldNote = result.rows[0];
        title = title || oldNote.title;
        content = content || oldNote.content;
        date = date || moment().unix();
        archived = archived || oldNote.archived;
        expanded = expanded || oldNote.expanded;
      }
    );
    pool.query(
      `UPDATE ${notesTable} SET title = ($1), content = ($2), date = ($3), archived = ($4), expanded = ($5) RETURNING *`,
      [ title, content, date, archived, expanded ],
      (err, result) => {
        if (err) {
          res.status(500).json({
            msg : '500 Database Error',
            err : { name: err.name, message: err.message },
          });
          return;
        }
        res.status(200).json(result.rows[0]);
      }
    );
  }
};

module.exports = {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
};
