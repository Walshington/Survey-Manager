var express = require('express');
var router = express.Router();
var sql = require('./config/db_config');

//Middle ware that is specific to this router (example for now)
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

// Define the home page route
router.get('/', function(req, res) {
  res.send('home page');
});

/*LOGIN AND REGISTER */

router.post("/register", (req, res) => {
  /* Need name, email, and password sent from clientside */
  const req_name = req.body.name;
  const req_email = req.body.email;
  const req_pass = req.body.password;
  
  /* If data exists */
  if(req_name && req_email && req_pass)
  {
    sql.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', 
    [req_name, req_email, req_pass],(err, rows, fields) => {
      if (err) throw err;
    })
    console.log("we made it")
    res.status(200).send('User successfully registered');
  }
  else
  {
    res.send('Please enter name, email, and password.')
  }
});

/* I still need to add sessions to this at some point */
router.post('/login', function(req, res) {
  /* Need email, and password sent from clientside */
  const req_email = req.body.email;
  const req_pass = req.body.password;

  sql.query('SELECT * FROM users WHERE email = ? AND password = ?', 
  [req_email, req_pass],(err, rows, fields) => {
    if (err) throw err;

    if(rows.length > 0)
    {
      /* Login the user */
      res.status(200).send('User successfully logged in');
    }
    else
    {
      res.status(201).send('user not found');
    }
  })
});


module.exports = router;
