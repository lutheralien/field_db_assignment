const jwt = require('jsonwebtoken');
const path = require('path')
const mysql = require('mysql');
const env = require('dotenv')
env.config({path:(path.join(__dirname, '../.env'))})

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  dateStrings: 'date',
  database: process.env.DB_NAME,
});
const selectID = (id) => {
  return new Promise((resolve, reject) => {
    const sql1 = 'SELECT group_name FROM users WHERE user_id = ?';
    db.query(sql1, [id], (err, results) => {
      if (err) return reject(err);
      return resolve(results);
    });
  });
};

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, result) => {
      if (err) {
        req.flash(
          'error_msg',
          'You need to login as Admin in order to view that source!'
        );
        res.redirect('/user/unauthorized');
      } else {
        
        const data = await selectID(result.id); 
        
        if (data.length === 0) {
          req.flash(
            'error_msg',
            'You need to login as Admin in order to view that source!'
          );
          res.redirect('/user/unauthorized');
        } else {
          req.user = result.id;
            next();
        }
      }
    });
  } else {
    req.flash(
      'error_msg',
      'You need to login as Admin in order to view that source!'
    );
    res.redirect('/user/unauthorized');
  }
};

const forwardAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  
    if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, result) => {
      if (err) {
        next();
      } else {
        const data = await selectID(result.id);
        if (data.length === 0) {
          next();
        } else {
          req.user = result.id;
          res.redirect('/user/dashboard');
        }
      }
    });
  } else {
    next();
  }
};

module.exports = { requireAuth, forwardAuth };
