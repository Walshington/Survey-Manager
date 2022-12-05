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
  "createdBy":"test@test.com",
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
          }
        );
      }
      res.status(200).send("Survey successfully added");
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

/*************** RESPONSES *****************/

/*
{
  "response" : ["question1" : 4, ],
  "email" : "testuser1@gmail.com",
  "surveyID" : 46,
  "dateSubmitted" : "2000-09-25"
}
*/

//Updates response fields after user responds to a survey
router.post("/updateresponse", (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");

  const req_response = JSON.stringify(req.body.response);
  const req_email = req.body.email;
  const req_surveyID = req.body.surveyID;
  const req_date_submitted = req.body.dateSubmitted;

  sql.query(
    "UPDATE responses SET response=?, status=1, dateSubmitted=? WHERE email=? AND surveyID=?",
    [req_response, req_date_submitted, req_email, req_surveyID],
    (err, rows, fields) => {
      if (err) throw err;
    }
  );
  res.status(200).send("Survey response successfully updated");
});

/*
{
  "surveyID" : ""
}
*/

//Creates a survey report
router.post("/report", (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");

  const req_surveyID = req.body.surveyID;

  sql.query(
    "SELECT * FROM responses WHERE surveyID=? AND status=1",
    [req_surveyID],
    (err, rows, fields) => {
      if (err) throw err;
      const t1_answers = [];
      const count = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      for (i = 0; i < rows.length; i++) {
        const answer = rows[i].response.question1;
        t1_answers.push(answer);
        //This will count how many occurences opf each answer we have
        if (count[answer]) {
          count[answer] += 1;
        } else {
          count[answer] = 1;
        }
      }

      max = 0;
      for (const answer in count) {
        if (count[answer] > max) {
          max = count[answer];
          ans = answer;
        }
      }
      mean = { answer: ans, mean: ((max / rows.length) * 100).toFixed(0) };
      response = { stats: mean, responses: rows };
      res.json(response);
    }
  );
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
        res.status(200).send("User successfully logged in");
      } else {
        res.status(201).send("user not found");
      }
    }
  );
});

module.exports = router;
