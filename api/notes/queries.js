require("dotenv").config({ path: "../" });
const axios = require("axios");
const moment = require("moment");
const { Pool } = require("pg");

const pool = new Pool();

const notesTable = process.env.NOTE_TABLE || "notes";

// GET /api/notes gets all notes in db
const getNotes = (req, res) => {
  pool.query(
    `SELECT * FROM ${notesTable} ORDER BY date DESC`,
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({
          msg: "500 Database Error",
          err: err,
          summary: { name: err.name, message: err.message },
        });
        return;
      }
      res.status(200).json(result.rows);
    }
  );
};

// GET /api/notes/:id gets note with id :id
const getNoteById = (req, res) => {
  const id = parseInt(req.params.id);
  if (Number.isNaN(id)) {
    res.status(400).json({ err: "BAD REQUEST: id must be an int" });
    return;
  } else {
    pool.query(
      `SELECT * FROM ${notesTable} WHERE id = ($1)`,
      [id],
      (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).json({
            msg: "500 Database Error",
            err: err,
            summary: { name: err.name, message: err.message },
          });
          return;
        }
        res.status(200).json(result.rows[0]);
      }
    );
  }
};

// POST /api/Notes title=random title&complete=false
const createNote = (req, res) => {
  let { title, content, date, archived, severity } = req.body;
  title = title || "No Title";
  content = content || "No Content";
  date = date || moment().unix();
  archived = archived || false;
  severity = severity || 50;
  pool.query(
    `INSERT INTO ${notesTable} ( title, content, date, archived, severity ) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [title, content, date, archived, severity],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({
          msg: "500 Database Error",
          err: err,
          summary: { name: err.name, message: err.message },
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
    res.status(400).json({ err: "BAD REQUEST: id must be an int" });
    return;
  } else {
    pool.query(
      `DELETE FROM ${notesTable} WHERE id = ($1)`,
      [id],
      (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).json({
            msg: "500 Database Error",
            err: err,
            summary: { name: err.name, message: err.message },
          });
        }

        res.status(200).json({
          msg: `note deleted with id ${id}`,
          id: id,
        });
      }
    );
  }
};

// PUT /api/notes/new/:id -d 'title=new title'
const updateNote = (req, res) => {
  const id = parseInt(req.params.id);
  let oldNote;
  let { title, content, date, archived, severity } = req.body;

  // console.log('IN API.... DELETE THIS LOG');

  if (Number.isNaN(id)) {
    res.status(400).json({ err: "BAD REQUEST: id must be an int" });
    return;
  } else {
    axios
      .get(
        `http://${process.env.HOST || "localhost"}:${
          process.env.PORT || "54321"
        }/api/notes/${id}`
      )
      .then((result) => {
        if (result.err) {
          throw result.err;
        }

        oldNote = result.data;
        date = date || title || content ? moment().unix() : oldNote.date;
        title = title || oldNote.title;
        content = content || oldNote.content;
        severity = severity || oldNote.severity;
        archived = archived === undefined ? oldNote.archived : archived;

        pool.query(
          `UPDATE ${notesTable} SET title = ($1), content = ($2), date = ($3), archived = ($4), severity = ($5) WHERE id = ($6) RETURNING *`,
          [title, content, date, archived, severity, id],
          (err, result) => {
            if (err) {
              console.error(err);
              result.status(500).json({
                msg: "500 Database Error",
                err: err,
                summary: { name: err.name, message: err.message },
              });
              return;
            }
            res.status(200).json(result.rows[0]);
          }
        );
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({
          msg: "500 Database Error",
          err: err,
          summary: { name: err.name, message: err.message },
        });
        return;
      });
  }
};

module.exports = {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
};
