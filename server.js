"use strict";

require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const bodyParser  = require("body-parser");
const sass        = require("node-sass-middleware");
const app         = express();

const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');

// Seperated Routes for each Resource
const usersRoutes = require("./routes/users");

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  src: __dirname + "/scripts",
  dest: __dirname + "/public/scripts",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Mount all resource routes
app.use("/api/users", usersRoutes(knex));


const API_KEY = '180aaac2c274f753b9ebc35ca9980988-c8c889c9-c0a21c63';
const DOMAIN = 'sandbox13ab78f450584a279b80af5d688f381f.mailgun.org';
const mailgun = require('mailgun-js')({apiKey: API_KEY, domain: DOMAIN});

let cookieSession = require('cookie-session');
app.use(cookieSession({
  name: 'session',
  keys: ['Key'],
  maxAge: 24 * 60 * 60 * 1000
}));



// Home page
app.get("/", (req, res) => {
  console.log ("### server.js - app.get'/'");
  // res.render("index");
  res.render("welcome");
});

app.get("/welcome", (req, res) => {
  res.render("welcome");
});

app.get("/thank_you", (req, res) => {
  res.render("thank_you");
});

// https://gist.github.com/laurenfazah/f9343ae8577999d301334fc68179b485
// check admin and password (simple away)
function checkAdmin(user, password) {
  return knex
  .select("*")
  .from("admin")
  .where('email', user)
  .andWhere('password', password)
}







// login page
app.get("/login", (req, res) => {
  console.log ("### server.js - GET'/LOGIN'");
  res.render("login");
});

app.post("/login", (req, res) => {
  checkAdmin(req.body.email, req.body.password).then((results) => {
    console.log("RESULTS: ", results.length);

    // console.log("login::::: ", login);
    if (!results.length) {
      res.render("welcome");
      return;
    }

    console.log("results are OK: ", results[0].id);
    req.session.admin_id = results[0].id;
    res.redirect("/admin");
  });
});


// admin page
app.get("/admin", (req, res) => {
  console.log("req.session.admin_id: ", req.session.admin_id);
  if (!req.session.admin_id) {
    res.render("login");
    return;
  }
  // console.log ("### server.js - GET'/LOGIN'");
  res.render("admin_homepage");
});


// register page
app.get("/register", (req, res) => {
  console.log ("### server.js - app.get'/REGISTER'");
  res.render("register");
});

app.post("/register", (req, res) => {
  console.log ("### server.js - app.get'/LOGIN'");
  console.log("req.body.email: ", req.body.email, " req.body.password: ", req.body.password);
  res.render("register");
});


// create_poll page
app.get("/create_poll", (req, res) => {
  if (!req.session.admin_id) {
    res.render("login");
    return;
  }
  res.render("create_poll");
});

app.post("/create_poll", (req, res) => {
  if (!req.session.admin_id) {
    res.render("login");
    return;
  }

  recordPoll(req.body, req.session.admin_id)
    .then((poll_id) => {
      let promiseArray = req.body.option;

      // send email thing
      let emailArray = req.body.email;
      emailArray.map((email) => {
        sendURL(email, poll_id[0]);
      });


      // console.log("promiseArray:  ", promiseArray, "pollid", poll_id);
      return Promise.all(promiseArray.map((option) => {
        // console.log("option: ", option);
        return knex('option').insert({
          label: option,
          poll_id: poll_id[0]
        })
      }))
    })
    .then(() => {
      res.redirect("/admin");
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    })
});


// record poll in the database
function recordPoll(data, admin_id) {
  console.log("data: ", data, "admin_id: ", admin_id);
  return knex('poll').returning('id')
    .insert(
      {question: data.title,
      description: data.description,
      admin_id: admin_id}
    );
}


// admin page
app.get("/results", (req, res) => {
  console.log("req.session.admin_id: ", req.session.admin_id);
  if (!req.session.admin_id) {
    res.render("login");
    return;
  }

    getPolls(req.session.admin_id)
      .then((results) => {
        res.render("results", { results });
      });

});


function getPolls(admin_id){
  return knex.select('id')
    .from('poll')
    .where('admin_id', admin_id);
}


// vote page
app.get("/vote/:id", (req, res) => {
  const poll_id = req.params.id;

  retrievePolldata(poll_id)
  .then((poll_raw) => {
    const poll = { dataToVote :
      {

      question: poll_raw[0].question,
      description: poll_raw[0].description,
      }
    };

    let options = [];
    retrieveOptionData(poll_id)
      .then((data) => {
        for(let i in data) {
          const tempID = data[i].id;
          const tempLabel = data[i].label;
          if (tempLabel !== '') {
            let tempObj = {};
            tempObj = {
              id: tempID,
              label: data[i].label
            };
            options.push(tempObj);
          }
        }
        poll.dataToVote.options = options;
        res.render("vote", poll);
      });
  })
  .catch((err) => {
    res.sendStatus(400);
  })

});


function retrievePolldata(poll_id){
  return knex.select('*')
    .from('poll')
    .where('id', poll_id);
}

function retrieveOptionData(poll_id) {
  let tempArray = [];
  return knex.from('option').select('*').where('poll_id', poll_id)
    .then((results) => {
      results.forEach((result) => {
        tempArray.push(result);
      })
      return tempArray;
    });
}

app.post("/vote", (req, res) => {
  const vote = req.body.votes;
  const MAX = vote.length;

  for (let i = 0; i < MAX; i += 1){
    recordVote(vote[i], MAX - i);
  }
  res.send("/thank_you");
});



// record vote in the database
function recordVote(option_id, score) {
  return knex('vote')
    .insert(
      { option_id,
        score
      }
    ).then(() => {
      console.log("recorded");
    });
}






app.get("/result", (req, res) => {
  res.render("result");
});

// admin page
// todo
// app.get("/result/:id", (req, res) => {
//   if (!req.session.admin_id) {
//     res.render("login");
//     return;
//   }
//   const poll_id = req.params.id;
//   console.log("poll_id: ", poll_id);
//     getVotes(poll_id)
//       .then((results) => {
//         console.log("results:: ", results);

//         let scores = {};
//         for (let i in results) {

//         }

//         // res.render("result", { results });
//       });
// });

// function getVotes(poll_id){
//   return knex.select('id')
//     .from('option')
//     .where('poll_id', poll_id);
// }









// logout feature
app.post("/logout", (req, res) => {
  req.session = null;
  res.render("welcome");
});



function sendURL(email, id) {
  const data = {
    from: 'Excited User <matt.r.kelly27@gmail.com>',
    to: email,  //add email list
    subject: `New Poll ${id}`,
    text: `Please, take this poll: http://localhost:8080/vote/${id}`  //add link to poll page
  };

  mailgun.messages().send(data, (error, body) => {
    // console.log(body);
  });
}



app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
