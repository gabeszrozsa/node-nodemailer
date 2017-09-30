const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();

// View engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');


// Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// Body Parser Middleware (github copy)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
app.get('/', (req, res) => {
  res.render('contact');
});

app.post('/send', (req, res) => {
  const output =
  `<p>You have a new contact request</p>
    <h3>Contact details:</h3>
    <ul>
      <li>Name: ${req.body.name}</li>
      <li>Company: ${req.body.company}</li>
      <li>Email: ${req.body.email}</li>
      <li>Phone: ${req.body.phone}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>`;

    // account infos
    let transporter = nodemailer.createTransport({
      host: 'smtp.mailgun.org',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'postmaster@sandbox64b816b07313472c82ae95a2b06c7d16.mailgun.org', // generated ethereal user
        pass: '8f6041a3ce30aa081e89341b520f54ed'  // generated ethereal password
      },
      tls: { //for localhost trying (not domain)
        rejectUnauthorized:false
      }
    });

    // setup email data with unicode symbols
    let mailOptions = {
      from: '"Nodemailer Contact" <test@traversymedia.com>', // sender address
      to: 'gabesz.rozsa@gmail.com', // list of receivers
      subject: 'Node Contact Request', // Subject line
      text: 'Hello world?', // plain text body
      html: output // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));


      res.render('contact', {msg:'Email has been sent'});
    });


})


// Port
app.listen(3000, () => {
  console.log('Server started.');
});
