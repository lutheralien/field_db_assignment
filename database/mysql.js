const mysql=require('mysql');
const path = require('path')
const env = require('dotenv')
env.config({path:(path.join(__dirname, '../.env'))})

module.exports = class Mysql {
  static connect() {
    // establish connection
    const db = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,   
      database: process.env.DB_NAME,
    });
    // connect to database
    db.connect((err) => {
      if (err) {
        throw err;
      }
      console.log('Connected Successfully!');
    });
    return db;
  }
};

