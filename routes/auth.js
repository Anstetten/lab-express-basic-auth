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
        res.render('auth/signUp.hbs', {errorMessage:'ERROR: Please provide an email and a password'});
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


module.exports = router;

