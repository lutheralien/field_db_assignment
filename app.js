const express = require('express');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser')
const env = require('dotenv')
const sql = require('./database/mysql');

env.config();
const app = express();

sql.connect();    

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(flash());
  
// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});


const userRoutes = require('./routes/user')
const homeRoutes = require('./routes/home')


app.use(express.static(__dirname + '/public'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());


app.use('/', homeRoutes)
app.use('/user', userRoutes)


const port = process.env.PORT

app.listen(port, (req, res) => {console.log('port is waiting...')})
