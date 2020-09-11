require('dotenv').config({ path: '../' });
const nodemailer = require('nodemailer');
const logger = require('../middleware/logger');
const clid = process.env.CLIENTID;
const clsec = process.env.CLIENTSECRET;
const refrtok = process.env.REFRESHTOKEN;
const from = process.env.FROMEMAIL;
const to = process.env.TOEMAIL;
const logs = require('../../logs.json');

var transporter = nodemailer.createTransport({
  host   : 'smtp.gmail.com',
  port   : 465,
  secure : true,
  auth   : {
    type         : 'OAuth2',
    user         : from,
    clientId     : clid,
    clientSecret : clsec,
    refreshToken : refrtok,
  },
});

sendEmail = async (req, res) => {
  let { replyto, subject, name, content, attachments } = req.body;
  const log = logs[logger.getIP(req)];
  if (!replyto) replyto = 'No Return Address';
  if (!subject) subject = 'No Subject';
  if (!name) name = 'No Name Given';
  if (!content) content = 'No Content';

  transporter.sendMail(
    {
      from        : `"${name}" <mailer@barbieux.dev>`,
      to          : `${to}`,
      subject     : `${subject}`,
      html        : `
<!DOCTYPE html>
<html lang="en">

  <head>
    <style>
      .Tiled-back {
        min-height: 100vh;
        background: url('https://barbieux.dev/bg-pblue-str.png');
        overflow-x: hidden;
        background-repeat: round;
        background-size: 64px;
      }

      .table-header {
        vertical-align: top;
        font-family: "Source Code Pro", monospace;
        padding: 11px;
        border-bottom: 1px solid rgb(227, 227, 218);
        font-size: 14px
      }
    </style>
  </head>

  <body class="Tiled-back">
    <div bgcolor="#ffffff" height="100%" width="100%">


      <table class="Tiled-back" style="width:100%;margin:0px auto" width="100%">
        <tbody>
          <tr>
            <td valign="top" align="center" style="vertical-align:top">
              <table style="width:100%" width="100%">
                <tbody>
                  <tr>
                    <td align="center" style="vertical-align:top;color:rgb(16,55,66);padding:22px" valign="top">
                      <div>
                        <img src="https://barbieux.dev/logo512.png" alt="Sherbert icon" width="66px" height="66px"
                          style="max-width:100%;margin-bottom:22px">
                      </div>
                      <p
                        style="color:white;font-weight:700;font-family:Poppins,sans-serif;margin:0px;text-transform:uppercase">
                        ${name} Sent a message</p>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table style="width:100%;background-color:white;max-width:616px;">
                <tbody>
                  <tr>
                    <td valign="top">
                      <table style="width:100%;">

                        <tbody>
                        <tr>
                            <td class="table-header" valign="top">
                              <strong>name:</strong><br>
                              <pre>${name}</pre>
                            </td >
                          </tr >
                          <tr>
                            <td class="table-header" valign="top">
                              <strong>email:</strong><br>
                              <pre>${replyto}</pre>
                            </td>
                          </tr>
                          <tr>
                            <td class="table-header" valign="top">
                              <strong>subject:</strong><br>
                              <pre>${subject}</pre>
                            </td>
                          </tr>
                          <tr>
                            <td class="table-header" valign="top">
                              <strong>message:</strong><br>
                              <pre>${content}</pre>
                            </td>
                          </tr>

                        </tbody>
                      </table>
                    </td>
                  </tr>
                  <tr align="center" style="padding:0px 0px 22px">
                    <td style="padding:11px;">
                      <span style="color:rgb(145,143,141);font-size:12px">${log
                        .geo.country} ${log.geo.region} ${log.geo
        .city} --- ${log.time} --- ${logger.getIP(req)}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </body>

</html>
    `,
      attachments : attachments.map((attch) => ({
        filename : attch.filename,
        content  : new Buffer.from(attch.raw.split('base64,')[1], 'base64'),
      })),
    },
    (err, info) => {
      if (err) {
        console.log('ERROR SENDING MAIL');
        console.error(err);
      } else {
        console.log('SENT MAIL!');
        res.status(200).json({
          status      : 'Sent Email!, updated msg',
          from        : `${log.country} ${log.region} ${log.city}`,
          time        : `${log.time}`,
          subject,
          name,
          content,
          replyto,
          emailid     : info,
          attachments,
        });
      }
    }
  );
};
module.exports = sendEmail;
