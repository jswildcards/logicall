import mysql from 'mysql2';

const connection = mysql.createConnection({
  host: process?.env?.NODE_ENV === 'production' ? 'mysql' : 'localhost',
  user: 'docker',
  password: 'docker',
  database: 'classicmodels'
}).promise();

export default connection;
