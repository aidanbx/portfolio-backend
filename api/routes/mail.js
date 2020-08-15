const express = require('express');
const sendEmail = require('../mailer/sendEmail');
const router = express.Router();

router.post('/', (req, res) => {
  sendEmail(req, res).catch(console.error);
});

module.exports = router;
