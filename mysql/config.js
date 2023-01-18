const mysql = require('mysql');

module.exports = {
  getCon: () => mysql.createConnection({
    host: "localhost",
    user: "airbnb",
    password: "comp206",
    database: "restaurants"
  }),
  functions: mysql
};