var API_KEY = '180aaac2c274f753b9ebc35ca9980988-c8c889c9-c0a21c63';
var DOMAIN = 'sandbox13ab78f450584a279b80af5d688f381f.mailgun.org';
var mailgun = require('mailgun-js')({apiKey: API_KEY, domain: DOMAIN});

const data = {
  from: 'Excited User <matt.r.kelly27@gmail.com>',
  to: 'matt.r.kelly27@gmail.com, tony.kieling@gmail.com',  //add email list
  subject: 'Hello',
  text: 'Testing some Mailgun awesomeness for the Delphi project!'  //add link to poll page
};

mailgun.messages().send(data, (error, body) => {
  console.log(body);
});