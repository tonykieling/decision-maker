  router.get("/", (req, res) => {
    knex
      .select("*")
      .from("admin")
      .then((results) => {
        console.log("### results: ", results);
        res.json(results);
    });
  });

  app.get("/", (req, res) => {
  console.log ("### server.js - app.get'/'");
  res.render("index");
});



// route to the admin register page
// should create a a file views/admin_register.ejs
router.get("/register", (req, res) => {
  res.render("admin_register");
});


// route to register admins
router.post("/register", (req, res) => {
  // check if the email or password are empty, if so, it sends 400
  if ((!req.body.email) || (!req.body.password)){
    res.send("Please, fill the email and password.");
    return;
  }
  const checkUser = (Object.keys(users).filter(key =>
    users[key].email === req.body.email
  )).toString();
  if ((checkUser.length)){ // check whether user alread exists into the db, if so, error
    res.send("User already exists");
    return;
  }
  const randomUserId = generateRandomString();    // calling the function to generate a random set of characteres which is gonna be used as user's id
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  users[randomUserId] = {
    id: randomUserId,
    email: req.body.email,
    password: hashedPassword
  };

  req.session.user_id = randomUserId;
  res.redirect("/urls");
});
