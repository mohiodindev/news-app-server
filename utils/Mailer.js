const mailer = require("nodemailer");

const _ = require("lodash");

const config = {
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
};

const transport = mailer.createTransport(config);

var defaultMail = {
  from: process.env.EMAIL,
  text: "This is a test email",
};

exports.send = (to, subject, html) => {
  // use default setting
  mail = _.merge({ html }, defaultMail, to);

  // send email
  transport.sendMail(mail, function (error, info) {
    if (error) return console.log(error);
    console.log("mail sent:", info.response);
  });
};
