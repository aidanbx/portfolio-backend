require('dotenv').config({ path: '../' });
const nodemailer = require('nodemailer');
const logger = require('../middleware/logger');
const password = process.env.DEVPASS;
const from = process.env.DEVEMAIL;
const to = process.env.TOEMAIL;

var transporter = nodemailer.createTransport({
	host: 'mail.privateemail.com',
	srcure: true,
	port: 465,
	auth: {
		user: from,
		pass: password
	}
	// dkim: {
	//   domainName: 'privateemail.com',
	//   keySelector: '2020',
	//   privateKey: '',
	// }
});

sendEmail = async (req, res) => {
	let { replyto, subject, name, content } = req.body;

	const log = logger.getLog(req);
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
