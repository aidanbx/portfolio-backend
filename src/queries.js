require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool();

const todoListTable = process.env.TODOLIST_TABLE || 'todolist';

// GET /api/todos gets all todos in db
const getTodos = (req, res) => {
  pool.query(
    `SELECT * FROM ${todoListTable} ORDER BY id ASC`,
    (err, result) => {
      if (err) {
        throw err;
        return;
      }
      res.status(200).json(result.rows);
    }
  );
};

// GET /api/todos/:id gets todo with id :id
const getTodoById = (req, res) => {
  const id = parseInt(req.params.id);

  if (Number.isNaN(id)) {
    res.status(400).json({ err: 'BAD REQUEST: id must be an int' });
    return;
  } else {
    pool.query(
      `SELECT * FROM ${todoListTable} WHERE id= $2`,
      [ id ],
      (err, result) => {
        if (err) {
          res.status(500).json({
            err : '500 Database Error',
          });
          return;
        }
        res.status(200).json(result.rows[0]);
        next();
      }
    );
  }
};

// POST /api/todos title=random title&complete=false
const createTodo = (req, res) => {
  let { title, complete } = req.body;

  if (title == null) {
    title = 'No Title';
  }
  if (complete == null) {
    complete = false;
  }

  pool.query(
    `INSERT INTO ${todoListTable} ( title, complete) VALUES ($1, $2) RETURNING id`,
    [ title, complete ],
    (err, result) => {
      if (err) {
        res.status(500).json({
          err : '500 Database Error',
        });
        return;
      }
      newTodo = {
        id        : result.rows[0].id,
        title     : title,
        completed : complete,
      };
      console.log(newTodo);
      res.status(201).json(newTodo);
    }
  );
};

// DELETE /api/todos/:id
const deleteTodo = (req, res) => {
  const id = parseInt(req.params.id);

  if (Number.isNaN(id)) {
    res.status(400).json({ err: 'BAD REQUEST: id must be an int' });
    return;
  } else {
    pool.query(
      `DELETE FROM ${todoListTable} WHERE id=$1`,
      [ id ],
      (err, result) => {
        if (err) {
          res.status(500).json({
            err : '500 Database Error',
          });
        }

        res.status(200).json({
          msg : `todo deleted with id ${id}`,
          id  : id,
        });
      }
    );
  }
};

// PUT /api/todos/new/:id -d 'title=new title'
const updateTodo = (req, res) => {
  const id = parseInt(req.params.id);
  const { title, complete } = req.body;

  if (Number.isNaN(id)) {
    res.status(400).json({ err: 'BAD REQUEST: id must be an int' });
    return;
  } else {
    pool.query(
      `UPDATE ${todoListTable} SET title = $1, complete = $2 WHERE id = $3`,
      [ title, complete, id ],
      (err, result) => {
        if (err) {
          res.status(500).json({
            err : '500 Database Error',
          });
          return;
        }
        res.status(200).json({
          msg          : `Updated todo with id ${id}`,
          id           : id,
          newTodoTitle : title,
          newComplete  : complete,
        });
      }
    );
  }
};

// PUT /api/todos/:id toggles todo with id :id f
const toggleTodo = (req, res) => {
  const id = parseInt(req.params.id);

  if (Number.isNaN(id)) {
    res.status(400).json({ err: 'BAD REQUEST: id must be an int' });
    return;
  } else {
    pool.query(
      `UPDATE ${todoListTable} SET complete= NOT complete WHERE ID = $1`,
      [ id ],
      (err, result) => {
        if (err) {
          res.status(500).json({
            err : '500 Database Error',
          });
          return;
        }
        res.status(200).json({ msg: `Toggled todo with id: ${id}`, id: id });
      }
    );
  }
};

module.exports = {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodo,
};
