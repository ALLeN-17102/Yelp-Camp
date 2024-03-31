const express = require('express');
const router= express.Router();
// const passport = require('passport');
const User =require('../models/user');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport'); 
const { storeReturnTo } = require('../middleware');  
const users = require('../controllers/users');

router.get('/register',users.registerUser)

router.post('/register',catchAsync(users.register));

router.get('/login',users.login)

router.post('/login',storeReturnTo,passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),users.loginUser)

router.get('/logout', users.logout); 
module.exports=router;