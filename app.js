if(process.env.NODE_ENV!== "production")
{
  require('dotenv').config();
}
// console.log(process.env.secret);
const express = require("express");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const catchAsync = require("./utils/catchAsync");
const { campgroundSchema, reviewSchema } = require("./schemas");
const ExpressError = require("./utils/ExpressError");
const mongoose = require("mongoose");
const Campground = require("./models/campground");
const Review = require("./models/review");
// const Joi =require('joi');
const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/users");
const session = require("express-session");
const flash = require("connect-flash");
const passport= require('passport');
const LocalStrategy = require('passport-local');
const User= require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const dbUrl  = process.env.DB_URL;

const MongoDbStore = require('connect-mongo')(session);

const store = new MongoDbStore({
  url:'mongodb://127.0.0.1:27017/yelp-camp',
  secret: "Thisshouldbebettersecret",
  touchAfter:24*60*50
});

store.on("error",function(e){
  console.log("Session error",e);
})

const sessionConfig = {
  store,
  secret: "Thisshouldbebettersecret",
  resave: false,
  saveUninitialized: true,
  cookie: { 
    httpOnly:true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7 },
    maxAge:1000*60*60*24*7
};
// "mongodb://127.0.0.1:27017/yelp-camp"
mongoose
  .connect("mongodb://127.0.0.1:27017/yelp-camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database Connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
app.use(mongoSanitize({replaceWith:'_'}));
app.use(helmet({contentSecurityPolicy:false}));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

app.get('/fakeUser',async(req,res)=>{
  const user =new User({email:'helloAgmail.com',username:"Shivam"});
  const newUser = await User.register(user,'shivam123');
  res.send(newUser);
})


app.use((req,res,next)=>{
   //console.log(req.session);
    console.log(req.query);
    res.locals.currentUser=req.user;
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    next();
})

app.use("/", userRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);


app.get("/", (req, res) => {
  res.render("campgrounds/home");
});

// app.post('/campgrounds/:id/reviews',validateReview,catchAsync(async(req,res)=>{
//     const campground = await Campground.findById(req.params.id);
//     const review = new Review(req.body.review);
//     campground.reviews.push(review);
//     await review.save();
//     await campground.save();
//     res.redirect(`/campgrounds/${campground._id}`);
//     //  res.send("You made it");
// }))

// app.delete('/campgrounds/:id/reviews/:reviewId',catchAsync(async(req,res,next)=>{
//     const {id,reviewId}=req.params;
//     await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
//     await Review.findByIdAndDelete(reviewId);
//    res.redirect(`/campgrounds/${id}`);
// }))

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No something went wrong!!";
  res.status(statusCode).render("error", { err });

  // res.send("oh boy!!")
});
app.listen(3000, () => {
  console.log("Listening to port 3000");
});
