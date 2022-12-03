const env = require("dotenv").config();
const mysql = require("mysql2");

const database_port = process.env.DATABASE_PORT;
const database_name = process.env.DATABASE_NAME;
const database_host = process.env.DATABASE_HOST;
const database_user = process.env.DATABASE_USER;
const database_pass = process.env.DATABASE_PASS;

console.log(database_user);

const connection = mysql.createConnection({
  host: database_host,
  user: database_user,
  password: database_pass,
  database: database_name,
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("SQL database successfully connected!!");
});

module.exports = connection;
