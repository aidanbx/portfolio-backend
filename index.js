require('dotenv').config();
const todoApi = require('./src/todoApi');

const PORT = process.env.PORT || 5000;
const HOST = process.env.IP || 'localhost';

todoApi.listen(process.env.PORT || 54321, () =>
  console.log(`todoApi running at http://${HOST}:${PORT}/api`)
);
