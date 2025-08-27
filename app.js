require('dotenv').config();
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const db = require('./config/mongoose-connection');
const ownersRouter = require('./routes/ownersRouter');
const productsRouter = require('./routes/productsRouter');
const usersRouter = require('./routes/usersRouters');
const index = require('./routes/index');
const expressSession = require('express-session');
const flash = require('connect-flash'); 
require('dotenv').config();

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());


app.use(
  expressSession({
    secret: process.env.EXPRESS_SESSION_SECRET || 'defaultsecret', 
    resave: false,
    saveUninitialized: true,
  })
);

app.use(flash());
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});



app.use('/owners', ownersRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/', index);

app.listen(4000, () => {
  console.log('Server is working on http://localhost:4000');
});
