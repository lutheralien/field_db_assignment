const jwt = require('jsonwebtoken');
const path = require('path');
const mysql = require('mysql');
const fs = require('fs')


const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    dateStrings: 'date',
    database: process.env.DB_NAME,
  });


    // Database query promises
const zeroParamPromise = (sql) => {
    return new Promise((resolve, reject) => {
      db.query(sql, (err, results) => {
        if (err) return reject(err);
        return resolve(results);
      });
    });
  };

  const queryParamPromise = (sql, queryParam) => {
    return new Promise((resolve, reject) => {
      db.query(sql, queryParam, (err, results) => {
        if (err) return reject(err);
        return resolve(results);
      });
    });
  };



exports.getLoginPage = (req, res, next) => {
    res.render('user/login')
}

exports.postLoginPage =  async (req, res, next) => {
    const { name, password } = req.body;
    
    let errors = [];
    const sql1 = 'SELECT * FROM users WHERE group_name = ?';
    const users = await queryParamPromise(sql1, [name]);
    if (
      users.length === 0 ||
      !((password == users[0].password))
    ) {
      errors.push({ msg: 'Name or Password is Incorrect' });
      res.status(401).render('user/login', { errors });
      } else {
      const token = jwt.sign({ id: users[0].user_id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });
     await db.query(`UPDATE users SET last_login = now() WHERE user_id = '${users[0].user_id}'`);
      res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      
      res.redirect('/user/dashboard');
    }
}

exports.getUserDashboard = async (req, res, next) => {
   
  const sql = 'SELECT * FROM users WHERE user_id = ?';

  const user = (await queryParamPromise(sql, [req.user]))[0];
console.log(user);
  
    res.render('user/dashboard/dashboard', { user: user });
  };

  exports.getCreateUser = async (req, res, next) => {
    
    res.render('user/dashboard/createUser')
  }

  exports.postCreateUser = async  (req, res, next) => {
    const { name, gender, profession, name_of_institution, question_1, question_2, question_3, question_4, question_5, question_6, question_7, question_8, question_9, question_10 } = req.body
    
    const sql = 'SELECT * FROM users WHERE user_id = ?';
    const user = (await queryParamPromise(sql, [req.user]))[0];
    
   
let sentence = '';
let newSentence = '';
console.log(Array.isArray(question_5));
if (Array.isArray(question_5)) {
  for (let index = 0; index < question_5.length; index++) {
    const element = question_5[index];
    sentence = sentence +' ,' + element
}

newSentence = sentence.replace(' ,', '')
console.log(newSentence);
 
} else 
newSentence = question_5



const uniqueId = () => {
  const dateString = Date.now().toString(36);
  const randomness = Math.random().toString(36).substr(2);
  return dateString + randomness;
};


   const sql1 = 'INSERT INTO persons SET name = ?, gender = ?, profession = ?, name_of_institution = ?, question_1 = ? , question_2 = ? , question_3 = ?, question_4 = ?, question_5 = ?, question_6 = ?, question_7 = ?, question_8 = ?, question_9 = ?, question_10 = ?, user_id = ?';

   const results = await (queryParamPromise(sql1, [name, gender, profession, name_of_institution, question_1, question_2, question_3, question_4, newSentence, question_6, question_7, question_8, question_9, question_10, user.user_id] ))

   req.flash('success_msg', 'Person Created!');  
    res.redirect('/user/table-of-persons')
  }


  exports.getTableOfPersons =  async (req, res, next) => {

    const sql = 'SELECT * FROM users WHERE user_id = ?';
    const user = (await queryParamPromise(sql, [req.user]))[0];
    
   const sql1 = 'SELECT * FROM persons WHERE user_id = ?'

   const allPersons = (await queryParamPromise(sql1, [user.user_id]))


    res.render('user/dashboard/tableOfPersons', { userData: allPersons })
  }

exports.getDataSheet = async (req, res, next) => {

  const sql = 'SELECT * FROM users WHERE user_id = ?';
  const user = (await queryParamPromise(sql, [req.user]))[0];

  //Total number of persons
  const sql1 = 'SELECT person_id FROM persons WHERE user_id = ?'
  const numberOfPersons = (await(queryParamPromise(sql1, [user.user_id]))).length


  //Total number of Males
  const sql2 = 'SELECT person_id FROM persons WHERE user_id = ? AND gender = ?'
  const numberOfMalePersons  = (await (queryParamPromise(sql2, [user.user_id, 'MALE']))).length

  


  const numberofFemalePersons = numberOfPersons - numberOfMalePersons


 let data = [results = { persons: numberOfPersons, male: numberOfMalePersons, female: numberofFemalePersons }]

 
 
  res.render('user/dashboard/dataSheet', {userData: data})
}

  exports.getError403 = (req, res, next) => {
    res.render('user/dashboard/unauthorized')
  }


  exports.getUserLogOut = (req, res, next) => {
    res.cookie('jwt', '', {
       maxAge: 1 
      });
    req.flash('success_msg', 'You are logged out');
    res.status(200).redirect('/user/login');
  }