const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), 'api', '.env') });
const express = require('express');
const app = require('./api/api');

app.listen(app.get('PORT'), () =>
  console.log(
    `Express started on http://${app.get('IP')}:${app.get(
      'PORT'
    )}; press Ctrl-C to terminate.`
  )
);
