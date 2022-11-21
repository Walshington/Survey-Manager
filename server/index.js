const d = require('dotenv').config();

var express = require('express');
var app = express();

const port = process.env.PORT;
const hostname = process.env.HOSTNAME;

console.log(port);
console.log(hostname);

//Serve the static react build (Do this on live server)
//app.use(express.static('../client/build'))

//Use this if we want to serve static files
//app.use(express.static('public'));

//Using routes from route.js file
app.use(require('./routes'));  //http://127.0.0.1:8000/    http://127.0.0.1:8000/about

//app.use("/user",require('./routes'));  //http://127.0.0.1:8000/user  http://127.0.0.1:8000/user/about

var server = app.listen(process.env.PORT, process.env.HOSTNAME, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port);
})
