import express from 'express';
import mysql from 'mysql';
const app = express();

const connection = mysql.createConnection({
  host: 'mysql',
  user: 'docker',
  password: 'docker',
  database: 'classicmodels'
});

app.get('/api/customers', function(req, res) {
  const sql = 'SELECT * FROM customers';
  connection.query(sql, function(err, result, fields) {
    if (err) return res.json({err});
    res.json({result});
  });
});

app.get('/api/server-time', function(req, res) {
  res.json({ time: `${new Date()}` });
});

app.listen(3000);
