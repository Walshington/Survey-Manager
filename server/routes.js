var express = require("express");
var router = express.Router();
var sql = require("./config/db_config");

//Middle ware that is specific to this router (example for now)
router.use(function timeLog(req, res, next) {
  console.log("Time: ", Date.now());
  next();
});

// Define the home page route
router.get("/", function (req, res) {
  res.send("home page");
});

/*USERS*/

router.get("/users", (req, res) => {

  res.set("Access-Control-Allow-Origin", "*");

  sql.query("SELECT * FROM users", (err, rows, fields) => {
      if (err) throw err;
      res.json(rows);
    }
  );
});

/*SURVEYS*/ 

router.post("/survey", (req, res) => {

  res.set("Access-Control-Allow-Origin", "*");
  
  const req_id = req.body.userID;
  const req_title = req.body.title;
  const req_description = req.body.description;
  const req_start_date = req.body.startDate;
  const req_end_date = req.body.endDate;
  const req_created_by = req.body.createdBy
  const req_questions = JSON.stringify(req.body.questions); //Array

  /* If data exists */
  sql.query(
    "INSERT INTO surveys (id, title, description, startDate, endDate, createdBy, questions) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [req_id, req_title, req_description, req_start_date, req_end_date, req_created_by, req_questions],
    (err, rows, fields) => {
      if (err) throw err;
    }
  );
  res.status(200).send("Survey successfully added");
});

/*LOGIN AND REGISTER*/

router.post("/register", (req, res) => {
  /* Need name, email, and password sent from clientside */
  res.set("Access-Control-Allow-Origin", "*");
  const req_name = req.body.name;
  const req_email = req.body.email;
  const req_pass = req.body.password;

  /* If data exists */
  if (req_name && req_email && req_pass) {
    sql.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [req_name, req_email, req_pass],
      (err, rows, fields) => {
        if (err) throw err;
      }
    );
    console.log("we made it");
    res.status(200).send("User successfully registered");
  } else {
    res.send("Please enter name, email, and password.");
  }
});

/* I still need to add sessions to this at some point */
router.post("/login", function (req, res) {
  /* Need email, and password sent from clientside */
  const req_email = req.body.email;
  const req_pass = req.body.password;

  sql.query(
    "SELECT * FROM users WHERE email = ? AND password = ?",
    [req_email, req_pass],
    (err, rows, fields) => {
      if (err) throw err;

      if (rows.length > 0) {
        /* Login the user */
        req.currentUser = rows[0];
        res.status(200).send("User successfully logged in");
      } else {
        res.status(201).send("user not found");
      }
    }
  );
});

module.exports = router;
