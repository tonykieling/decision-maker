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
  // res.render("index");
  res.render("register");
});


// create_poll page
app.get("/create_poll", (req, res) => {
  console.log("req.session.admin_id: ", req.session.admin_id);
  if (!req.session.admin_id) {
    res.render("login");
    return;
  }
  console.log("create_pol GET");
  res.render("create_poll");
});

app.post("/create_poll", (req, res) => {
  // console.log("req.session.admin_id: ", req.session.admin_id);
  if (!req.session.admin_id) {
    res.render("login");
    return;
  }

  // console.log("POST cretae_poll!!!!!!");
  // console.log("req.body NEWWWW: ", req.body);
  console.log("req.body: ", req.body);
  var temp = req.body;
  let countOfOptions = 0;
  let tt;
  //console.log("test ",typeof temp);
  for(var key in temp){
      if(key.startsWith("op")){
        countOfOptions = key.slice(-1);
        tt = key.charAt(key.length - 1);
      }
  }

  //generating the dynamic array
  var optionsArr = [];
  for(var i = 1; i<=tt; i++){
    var x = "option"+i;
    optionsArr.push(req.body[x]);
  }
  console.log("Options Array",optionsArr);
  console.log(countOfOptions, tt);

  recordPoll(req.body, req.session.admin_id)
    .then((poll_id) => {
      //let promiseArray = req.body.option;
      //console.log("promiseArray:  ", promiseArray, "pollid", poll_id);
      return Promise.all(optionsArr.map((option) => {
        console.log("option: ", option);
        return knex('option').insert({
          label: option,
          poll_id: poll_id[0]
        });
      }))
    })
    .then(() => {
      console.log("recorded");
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





// vote page
app.get("/vote", (req, res) => {
  res.render("vote");
});

app.post("/vote", (req, res) => {
  console.log("route to POST VOTE");
  console.log("req.body.voteArray:: ", req.body.voteArray);
  res.render("welcome");
});


// result page
// app.get("/polls/:id", (req, res) => {
//   console.log ("### server.js - GET-results ");
//   // check if the admin is okay
//   // query postgresql for admin

//   // if okay, check if the poll_id belongs to this admin
//   // if okay, shows the result page
//   if (!urlDatabase[req.params.id]){
//     const templateVars = {temp: req.params.id};
//     res.render("no_shortURL", templateVars);
//     return;
//   }
//   let templateVars = { urls: urlDatabase[req.params.id] };
//   if (!req.session.user_id){
//     templateVars["user"] = null;
//     res.render("no_user_page");
//     return;
//   } else {
//     if (urlDatabase[req.params.id].userID !== req.session.user_id){
//       res.send("You are not the owner of this shortURL, therefore you can not edit it.");
//     }
//     urlDatabase[req.params.id].longURL = req.body.longURL;
//     res.redirect("/urls");
//   }

//   res.render("login");
// });


// logout feature
app.post("/logout", (req, res) => {
  req.session = null;
  res.render("welcome");
});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
