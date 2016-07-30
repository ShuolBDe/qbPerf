var mysql = require('mysql');
var connPool = mysql.createPool({
  connectionLimit : 10,
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'hypertext_latex'
});

module.exports = connPool;