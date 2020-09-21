import express from 'express';
import connection from './modules/db';
const app = express();

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

app.get('/api/customers', async function(req, res) {
  const sql = 'SELECT * FROM customers';
  const result = await connection.execute(sql);
  res.json({ result });
});

app.get('/api/employees', async function(req, res) {
  const sql = 'SELECT * FROM employees';
  const result = await connection.execute(sql);
  res.json({ result });
});

app.get('/api/offices', async function(req, res) {
  const sql = 'SELECT * FROM offices';
  const result = await connection.execute(sql);
  res.json({ result });
});

app.get('/api/orderdetails', async function(req, res) {
  const sql = 'SELECT * FROM orderdetails';
  const result = await connection.execute(sql);
  res.json({ result });
});

app.get('/api/orders', async function(req, res) {
  const sql = 'SELECT * FROM orders';
  const result = await connection.execute(sql);
  res.json({ result });
});

app.get('/api/payments', async function(req, res) {
  const sql = 'SELECT * FROM payments';
  const result = await connection.execute(sql);
  res.json({ result });
});

app.get('/api/productlines', async function(req, res) {
  const sql = 'SELECT * FROM productlines';
  const result = await connection.execute(sql);
  res.json({ result });
});

app.get('/api/products', async function(req, res) {
  const sql = 'SELECT * FROM products';
  const result = await connection.execute(sql);
  res.json({ result });
});

app.listen(3000);
