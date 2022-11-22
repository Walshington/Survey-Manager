const d = require('dotenv').config();
var express = require('express');
const mysql = require('mysql')
var app = express();

const port = process.env.PORT;
const hostname = process.env.HOSTNAME;
const database_port = process.env.DATABASE_PORT;
const database_name = process.env.DATABASE_NAME;
const database_host = process.env.DATABASE_HOST;
const database_user = process.env.DATABASE_USER;
const database_pass = process.env.DATABASE_PASS;


//Serve the static react build (Do this on live server)
//app.use(express.static('../client/build'))

//Use this if we want to serve static files
app.use(express.static('public'));

//Using routes from route.js file
app.use(require('./routes'));  //http://127.0.0.1:8000/    http://127.0.0.1:8000/about

app.use("/user",require('./routes'));  //http://127.0.0.1:8000/user  http://127.0.0.1:8000/user/about

var server = app.listen(process.env.PORT, process.env.HOSTNAME, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port);
})

/* DATABASE CONNECTION */

const connection = mysql.createConnection({
  host: database_host,
  user: database_user,
  password: database_pass,
  database: database_name
})

console.log(connection)

connection.connect()
