const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const bcrypt = require('bcrypt');
const SALT = 10;

router.get('/signup', (req,res,next)=>{
    res.render('auth/signUp.hbs');
});

//Signup section
router.post('/signup', async (req, res, next)=>{

 try{
    const user = req.body;
    //Check if the user provided the rquired data, if no throw message
    if(!user.password || !user.username) {
        res.render('auth/signUp.hbs', {errorMessage:'ERROR: Please provide both an email and a password'});
        return;
    }
    //Check if we can find a user already in our database with this name
    const foundUser = await User.findOne({username:user.username});

    //If yes throw error
    if (foundUser) {
        res.render('auth/signUp.hbs', {errorMessage:'ERROR: This username is already taken. Please choose another one'});
        return;
    }

    //If it is a new new user encrypt the pswd and give it to the user
    const hashedPassword = bcrypt.hashSync(user.password, SALT);
    user.password=hashedPassword;
    //Inject the new user to our database
    const createdUser = await User.create(user);
    console.log(createdUser);
    //Redirect to signin page
    res.redirect('/signin');
 }

 catch (error) {next(error);}
});


router.get('/signin', (req,res,next)=>{
    res.render('auth/signIn.hbs');
});

router.post('/signin', async (req,res,next)=>{

    try{
        const user = req.body;

        if(!user.password || !user.username) {
            res.render('auth/signIn.hbs', {errorMessage:'ERROR: Please provide both an email and a password'});
            return;
        }

        const foundUser = await User.findOne({username:req.body.username});

        if (!foundUser) {
            res.render("auth/signin.hbs", {
              errorMessage: "Bad credentials",
            });
            return;
          }

        const isValidPassword = bcrypt.compareSync(req.body.password, foundUser.password);

        if (isValidPassword) {
            req.session.currentUser = {_id:foundUser._id,};
            res.redirect("/users/profile");

        }
        else{
            res.render("auth/signin.hbs", {
                errorMessage: "Bad credentials",
              });
              return;
        }

    }
    catch (error) {
        next(error);
      }
});


//logout

router.post('/logout', (req, res, next) => {
    req.session.destroy(err => {
      if (err) next(err);
      res.redirect('/');
    });
  });


module.exports = router;

