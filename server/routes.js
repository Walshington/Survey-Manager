var express = require('express');
var router = express.Router();

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
    res.json({ message: "Hello from server!" });
});


module.exports = router;