if (process.env.NODE_ENV != 'production') {
  require('dotenv').config();
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');
const listings = require('./routes/listings.js');
const reviews = require('./routes/reviews.js');
const cookirParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const User = require('./models/user.js');
const passport = require('passport');
const userRouter = require('./routes/user.js');
const LocalStrategy = require('passport-local');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);

let dbUrl = process.env.ATLASDB_URL;

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECERET_CODE,
  },
  touchAfter: 24 * 3600,
});

store.on('error', () => {
  console.log('Error in Connect Mongo Session: ', err);
});

const sessionOption = {
  store,
  secret: process.env.SECERET_CODE,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOption));

app.use(cookirParser('2YA-mq<9_891'));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

main()
  .then(() => {
    console.log('DB is Connected Successfully.');
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

app.listen(8080, () => {
  console.log('App is listing on port 8080');
});

app.use(flash());
app.use((req, res, next) => {
  res.locals.errorMsg = req.flash('error');
  res.locals.successMsg = req.flash('success');
  res.locals.currUser = req.user;
  // console.log(res.locals.successMsg);
  next();
});

app.use('/listings', listings);
app.use('/listings/:id/reviews', reviews);
app.use('/', userRouter);

app.all('*', (req, res, next) => {
  throw new ExpressError(404, 'Page not found!');
});

app.use((err, req, res, next) => {
  let { status = 500, message = 'Some error occured!' } = err;
  res.status(status).render('./error.ejs', { err });
});
