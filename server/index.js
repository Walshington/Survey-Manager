var express = require('express');
var app = express();

//Use this if we want to serve static files
//app.use(express.static('public'));

//Using routes from route.js file
app.use(require('./routes'));  //http://127.0.0.1:8000/    http://127.0.0.1:8000/about

//app.use("/user",require('./routes'));  //http://127.0.0.1:8000/user  http://127.0.0.1:8000/user/about

var server = app.listen(3001, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)
})
