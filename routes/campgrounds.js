const express =require('express');
// const mongoose= require('mongoose');
const router = express.Router();
const catchAsync=require('../utils/catchAsync');
// const ExpressError=require('../utils/ExpressError');
const Campground= require('../models/campground');
const {campgroundSchema,reviewSchema}= require('../schemas');
const {isLoggedIn,isAuthor,validateCampground}= require('../middleware');
const campgrounds = require('../controllers/campgrounds');
const { MulterError } = require('multer');
const multer= require('multer');
const {storage}=require('../cloudinary');
// const upload  = multer({dest:'uploads/'})
const upload  = multer({storage});




router.get('/',catchAsync(campgrounds.index));
router.get('/new',isLoggedIn,campgrounds.renderNewForm);

router.post('/',isLoggedIn,upload.array('image'),validateCampground,catchAsync(campgrounds.createCampground))
// router.post('/',upload.array('image'),(req,res)=>{
//     console.log(req.body,req.files);
// })  

router.get('/:id',catchAsync(campgrounds.showCampground))

router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(campgrounds.renderEditForm))

router.put('/:id',isLoggedIn,upload.array('image'),validateCampground,catchAsync(campgrounds.updateCampground))

router.delete('/:id',isLoggedIn,catchAsync(campgrounds.deleteCampground))

module.exports=router; 