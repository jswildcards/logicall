import express from 'express';
import mysql from 'mysql';
const app = express();

const connection = mysql.createConnection({
  host: 'mysql',
  user: 'docker',
  password: 'docker',
  database: 'classicmodels'
});

app.get('/api', function(req, res) {
  res.json({
    result: [
      'customers',
      'employees',
      'offices',
      'orderdetails',
      'orders',
      'payments',
      'productlines',
      'products'
    ] 
  });
});

app.get('/api/customers', function(req, res) {
  const sql = 'SELECT * FROM customers';
  connection.query(sql, function(err, result, fields) {
    if (err) return res.json({err});
    res.json({result});
  });
});

app.get('/api/employees', function(req, res) {
  const sql = 'SELECT * FROM employees';
  connection.query(sql, function(err, result, fields) {
    if (err) return res.json({err});
    res.json({result});
  });
});

app.get('/api/offices', function(req, res) {
  const sql = 'SELECT * FROM offices';
  connection.query(sql, function(err, result, fields) {
    if (err) return res.json({err});
    res.json({result});
  });
});

app.get('/api/orderdetails', function(req, res) {
  const sql = 'SELECT * FROM orderdetails';
  connection.query(sql, function(err, result, fields) {
    if (err) return res.json({err});
    res.json({result});
  });
});

app.get('/api/orders', function(req, res) {
  const sql = 'SELECT * FROM orders';
  connection.query(sql, function(err, result, fields) {
    if (err) return res.json({err});
    res.json({result});
  });
});

app.get('/api/payments', function(req, res) {
  const sql = 'SELECT * FROM payments';
  connection.query(sql, function(err, result, fields) {
    if (err) return res.json({err});
    res.json({result});
  });
});

app.get('/api/productlines', function(req, res) {
  const sql = 'SELECT * FROM productlines';
  connection.query(sql, function(err, result, fields) {
    if (err) return res.json({err});
    res.json({result});
  });
});

app.get('/api/products', function(req, res) {
  const sql = 'SELECT * FROM products';
  connection.query(sql, function(err, result, fields) {
    if (err) return res.json({err});
    res.json({result});
  });
});

app.listen(3000);
