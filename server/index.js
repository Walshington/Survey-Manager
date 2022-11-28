const d = require('dotenv').config();
const mysql = require('mysql2');
var express = require('express');
var bodyParser = require('body-parser')
var session = require('express-session')
var app = express();
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

//Serve the static react build (Do this on live server)
//app.use(express.static('../client/build')

//Use this if we want to serve static files
app.use(express.static('public'));

//Using routes from route.js file
app.use(require('./routes'));  //http://127.0.0.1:8000/    http://127.0.0.1:8000/about

app.use("/user",require('./routes'));  //http://127.0.0.1:8000/user  http://127.0.0.1:8000/user/about

/* Server connection */

const port = process.env.PORT;
const hostname = process.env.HOSTNAME;

var server = app.listen(port, hostname, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port);
})
