import mysql from 'mysql2';
import { Database as DatabaseConfig } from './config';

console.log(DatabaseConfig);

export default mysql.createConnection(DatabaseConfig).promise();
