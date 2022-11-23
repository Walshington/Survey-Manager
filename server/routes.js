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

router.get("/api", (req, res) => {
  sql.query('SELECT * FROM Persons', (err, rows, fields) => {
    if (err) throw err;

    console.log('Persons table data: ', rows);
    res.json({row : rows[0].name});
  })
});

/*LOGIN AND REGISTER */

router.post('/login', function(req, res) {
  res.send('home page');
});


module.exports = router;
