// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require('dotenv/config');

// ℹ️ Connects to the database
require('./db');

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require('express');

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require('hbs');
const User = require('./models/User.model')
const app = express();

//Require the express session to handle sessions
const session = require('express-session');

// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require('./config')(app);

// default value for title local
const projectName = 'lab-express-basic-auth';
const capitalized = string => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)}- Generated with Ironlauncher`;

app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: true,
      saveUninitialized: true,
      //cookie: { secure: true },
    })
  );


app.use((req, res, next) => {
if (req.session.currentUser) {
    User.findById(req.session.currentUser._id)
    .then((userFromDb) => {
        res.locals.currentUser = userFromDb;
        res.locals.isLoggedIn = true;
        next();
        // res.locals.isAdmin = userFromDB.isAdmin
    })
    .catch((error) => {
        next(error);
    });
} else {
    res.locals.currentUser = undefined;
    res.locals.isLoggedIn = false;

    next();
}
});



  app.use((req, res, next) => {
    console.log(req.session);
    next();
  });


// 👇 Start handling routes here
const index = require('./routes/index');
const authRoutes = require('./routes/auth.js');
const userRoutes = require('./routes/users.js');
const privateRoutes= require('./routes/protectedRoutes');
app.use('/', index);
app.use('/', privateRoutes);
app.use('/',authRoutes);
app.use('/',userRoutes);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling')(app);

module.exports = app;

