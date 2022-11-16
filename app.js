const express = require('express');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser')
const env = require('dotenv')

const MySQLStore = require('express-mysql-session')(session);
const mysql = require('mysql')
const logger = require('morgan')
const cors = require('cors')



env.config();
const app = express();

const options = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,   
  database: process.env.DB_NAME,
}
const db = mysql.createConnection(options);
// connect to database
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected Successfully!');
});
const sessionStore = new MySQLStore({}, db);

    

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore
  })
);

app.use(flash());
app.use(logger('dev'));
app.use(cors());
app.use(methodOverride('_method'));
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
