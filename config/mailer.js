const nodemailer = require('nodemailer');

module.exports = function(email, subject, message) {
const mailTransport = nodemailer.createTransport({
service: 'gmail',
secure: false,
port: 25,
auth: { user: 'pphotoza@gmail.com', pass: 'ifafof65' },
tls: { rejectUnauthorized: false }
});
mailTransport.sendMail({
from: 'pphotoza',
to: email,
subject: subject,
text: message
}, function(err, info) {
  console.log(err);
console.log(info);
});
};
