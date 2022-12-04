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

/*************** USERS *****************/

router.get("/users", (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");

  sql.query("SELECT * FROM users", (err, rows, fields) => {
    if (err) throw err;
    res.json(rows);
  });
});

/*************** SURVEYS *****************/

/*
{
  "title":"testing participants and survey names",
  "description":"walsh is testing",
  "startDate":"2000-09-25",
  "endDate":"2000-09-29",
  "createdBy":"1",
  "questions": ["questionwwwww1", "question2", "question3"],
  "participants" : ["test@test.com", "testuser1@gmail.com", "testuser2@gmail.com"]
}
*/

//create new survey and generate response tuples for participants
router.post("/createsurvey", (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");

  const req_title = req.body.title;
  const req_description = req.body.description;
  const req_start_date = req.body.startDate;
  const req_end_date = req.body.endDate;
  const req_created_by = req.body.createdBy;
  const req_questions = JSON.stringify(req.body.questions); //Array
  const req_participants = JSON.stringify(req.body.participants); //Array storing email of every participant

  sql.query(
    "INSERT INTO surveys (title, description, startDate, endDate, questions, participants, createdBy) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [
      req_title,
      req_description,
      req_start_date,
      req_end_date,
      req_questions,
      req_participants,
      req_created_by,
    ],
    (err, rows, fields) => {
      if (err) throw err;
      surveyID = rows.insertId;

      /* after we grab json data we will loop through all emails and create response rows in database with status set to 0*/
      /*0 because they are not answered*/

      const len = req.body.participants.length;
      for (i = 0; i < len; i++) {
        sql.query(
          "INSERT INTO responses (email, surveyID, surveyName, response, status, dateSubmitted) VALUES (?, ?, ?, ?, ?, ?)",
          [req.body.participants[i], surveyID, req_title, null, 0, null],
          (err, rows, fields) => {
            if (err) throw err;
            res.status(200).send("Survey successfully added");
          }
        );
      }
    }
  );
});

/*
{
  "surveyID" : ""
}
*/
//Finds single survey based on surveyID
router.post("/getsurvey", (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");

  const req_surveyID = req.body.surveyID;

  sql.query(
    "SELECT * FROM surveys WHERE id=?",
    [req_surveyID],
    (err, rows, fields) => {
      if (err) throw err;
      res.json(rows);
    }
  );
});

/*
{
  "userID" : ""
}
*/

//Finds list of user created surveys based on userID (Lists all surveys for creator)
router.post("/getcreatorsurveylist", (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");

  const req_userID = req.body.userID;

  sql.query(
    "SELECT * FROM surveys WHERE createdBy=?",
    [req_userID],
    (err, rows, fields) => {
      if (err) throw err;
      res.json(rows);
    }
  );
});

/*
{
  "email" : ""
}
*/
//Finds list of user created surveys based on user email (Lists all surveys for participant)
router.post("/getparticipantsurveylist", (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");

  const req_email = req.body.email;

  sql.query(
    "SELECT * FROM responses WHERE email=?",
    [req_email],
    (err, rows, fields) => {
      if (err) throw err;
      res.json(rows);
    }
  );
});

/*
{
  "surveyID" : ""
}
*/
//Deletes survey based on surveyID
router.post("/deletesurvey", (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");

  const req_surveyID = req.body.surveyID;

  sql.query(
    "DELETE FROM surveys WHERE id=?",
    [req_surveyID],
    (err, rows, fields) => {
      if (err) throw err;
    }
  );

  sql.query(
    "DELETE FROM responses WHERE surveyID=?",
    [req_surveyID],
    (err, rows, fields) => {
      if (err) throw err;
    }
  );

  res.status(200).send("Survey and responses successfully deleted");
});

/*************** LOGIN AND REGISTER *****************/

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
