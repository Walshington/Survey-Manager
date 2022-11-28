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

router.post("/register", (req, res) => {
  const req_name = req.body.name;
  const req_email = req.body.email;
  const req_pass = req.body.password;

  sql.query('INSERT INTO users (name, email, password) as (req_name, req_email, req_pass)', (err, rows, fields) => {
    if (err) throw err;

    console.log("we made it")
    res.status(200).send('User successfully registered');
  })
});

/*LOGIN AND REGISTER */

router.post('/login', function(req, res) {
  res.send('home page');
});


module.exports = router;
