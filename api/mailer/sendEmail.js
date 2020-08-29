require('dotenv').config({ path: '../' });
const nodemailer = require('nodemailer');
const logger = require('../middleware/logger');
const xoauth2 = require('xoauth2');
const clid = process.env.CLIENTID;
const clsec = process.env.CLIENTSECRET;
const refrtok = process.env.REFRESHTOKEN;
const from = process.env.FROMEMAIL;
const to = process.env.TOEMAIL;
const logs = require('../../logs.json');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    xoauth2: xoauth2.createXOAuth2Generator({
      user: from,
      clientId: clid,
      clientSecret: clsec,
      refreshToken: refrtok
    })
  }
  // host: 'mail.privateemail.com',
  // srcure: true,
  // port: 465,
  // auth: {
  //   user: from,
  //   pass: password
  // }
  // dkim: {
  //   domainName: 'privateemail.com',
  //   keySelector: '2020',
  //   privateKey: '',
  // }
});

sendEmail = async (req, res) => {
  let { replyto, subject, name, content } = req.body;

  const log = logs[logger.getIP(req)];
  if (!replyto) replyto = 'No Return Address';
  if (!subject) subject = 'No Subject';
  if (!name) name = 'No Name Given';
  if (!content) content = 'No Content';

  const info = await transporter.sendMail({
    from: `"${name}" <${from}>`,
    to: `${to}`,
    subject: `${subject}`,
    html: `<h3>${name}</h3>
    <h4>${subject}</h4>
    <p>${content}</p>
    <p>Reply To: <b>${replyto}</b></p>
    <p>Sent From: <b>${log}</b></p>`
    // text    : `${name}\nSent from:\n${log} Content:\n\n${content}\n\n\nReply To:\n\t${replyto}`,
  });

  res.status(200).json({
    status: 'Sent Email!',
    from: log,
    subject,
    name,
    content,
    replyto,
    emailid: info
  });
};
module.exports = sendEmail;
