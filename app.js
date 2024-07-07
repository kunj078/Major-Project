  // use only development phase not production phase
  if(process.env.NODE_ENV != "producation"){
    require('dotenv').config()
  }
  const express = require("express");
  const app = express();
  const mongoose = require("mongoose");
  const path = require("path");
  const methodOverride = require("method-override");
  const ejsMate = require("ejs-mate");
  const session = require("express-session");
  const MongoStore = require('connect-mongo');
  const flash = require("connect-flash")
  const listingsRouter = require("./routes/listing.js") 
  const reviewsRouter = require("./routes/review.js") 
  const usersRouter = require("./routes/users.js") 
  const passport = require("passport");
  const localStrategy = require("passport-local");
  const User = require("./models/user.js");
  // const url = "mongodb://127.0.0.1:27017/airbnb";
  const dburl = process.env.ATLASDB_URL;
  
  main()
    .then(() => {
      console.log("connected to DB");
    })
    .catch((err) => {
      console.log(err);
    });

  async function main() {
    await mongoose.connect(dburl);
  }

  app.engine('ejs', ejsMate)
  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "views"));
  app.use(express.urlencoded({ extended: true }));
  app.use(methodOverride("_method"));
  app.use(express.static(path.join(__dirname, "/public")));
  
  const store = MongoStore.create({
    mongoUrl: dburl,
    crypto:{
      secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
  })

  store.on("error",()=>{
    console.log("Error in MONGO session Store...!!!",err)
  })

  const sessionOption = {
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
      exprires : Date.now() + 7 * 24 * 60 * 60 * 1000,
      maxAge : 7 * 24 * 60 * 60 * 1000,
      httpOnly : true 
    }
  };

  // app.get("/", (req, res) => {
  //   res.send("Hi, I am root");
  // });

  app.use(session(sessionOption))
  app.use(flash())

  // Password Authentication using local-stratergy
  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(new localStrategy(User.authenticate()))

  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());

  app.use((req,res,next)=>{
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    res.locals.currUser = req.user;
    // console.log(res.locals.success)
    next();
  });

  // app.get("/demouser", async(req, res)=>{
  //   let fakeUser = new User({
  //     email : "student@gmail.com",
  //     username : "abc"
  //   })
  //   // pbkdf2 hash Function is use 
  //   let registeredUser = await User.register(fakeUser,"HelloWorld")
  //   res.send(registeredUser)
  // })

  // // server-side validation for listing schema
  // const validateListing = (req,res,next)=>{
  //   let {error} = listingSchema.validate(req.body)
  //   // console.log(result);
  //   if(error){
  //     let errMsg = error.details.map((el) => el.message).join(",")
  //     throw new ExpressError(400, errMsg);
  //   } else {
  //     next(); 
  //   }
  // };

  app.use("/listings",listingsRouter);  
  
  // //Index Route
  // app.get("/listings", wrapAsync(async (req, res) => {
    //   const allListings = await Listing.find({});
    //   res.render("listings/index.ejs", { allListings });
    // }));
    
    // //New Route
    // app.get("/listings/new", (req, res) => {
      //   res.render("listings/new.ejs");
      // });
      
      // //Show Route
      // app.get("/listings/:id", wrapAsync(async (req, res) => {
        //   let { id } = req.params;
        //   const listing = await Listing.findById(id).populate("reviews"); // extrect data 
        //   res.render("listings/show.ejs", { listing });
        // }));
        
        // //Create Route
        // app.post("/listings", validateListing, wrapAsync(async (req, res, next) => {
          //   // let result = listingSchema.validate(req.body)
          //   // console.log(result);
          //   // if(result.error){
            //   //   throw new ExpressError(400, result.error);
            //   // }
            //   const newListing = new Listing(req.body.listing);
            //   // if(!newListing.description){
              //   //   throw new ExpressError(400, "Description is missing...!!!");
              //   // }
              //   await newListing.save(); 
              //   res.redirect("/listings");
              // }));
              
  // // Edit Route

  // app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    //   let { id } = req.params;
    //   const listing = await Listing.findById(id);
    //   res.render("listings/edit.ejs", { listing });
    // }));
    
    // // Update Route
    
    // app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {
      //   // if(!req.body.listing){
        //   //   throw new ExpressError(400, "Send valid data for listing");
        //   // }
        //   let { id } = req.params;
        //   await Listing.findByIdAndUpdate(id, { ...req.body.listing });
        //   res.redirect(`/listings/${id}`);
  // }));

  // // Delete Route

  // app.delete("/listings/:id",wrapAsync(async (req,res)=>{
    //   let { id } = req.params;
  //   const dltedLising = await Listing.findByIdAndDelete(id);
  //   console.log(dltedLising);
  //   res.redirect("/listings");  
  // }))
    
  app.use("/listings/:id/reviews", reviewsRouter);  
  app.use("/", usersRouter);  
    
  // // server-side validation for review schema
  // const validateReview = (req,res,next)=>{
  //   let {error} = reviewSchema.validate(req.body);
  //   // console.log(result);
  //   if(error){
  //     let errMsg = error.details.map((el) => el.message).join(",")
  //     throw new ExpressError(400, errMsg);
  //   } else {
  //       next(); 
  //   }
  // };
        
  //         // POST Reviews route
  // app.post("/listings/:id/reviews", validateReview, wrapAsync(async (req,res)=>{
  //   let listing = await Listing.findById(req.params.id)
  //   let newReview = new Review(req.body.review);

  //   listing.reviews.push(newReview);
  
  //   await newReview.save();
  //   await listing.save();
  
  //   console.log("New review saved");
  //   // res.send("New Review saved...!!!")
  //   res.redirect(`/listings/${listing._id}`);
  // }))
  
  // // POST Delete Route
  // app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async (req,res)=>{
  //     let {id, reviewId} = req.params;
    
  //     await Listing.findByIdAndUpdate(id, {$pull : {reviews: reviewId}}); // remove from review array where the id matches
  //     await Review.findByIdAndDelete(reviewId);
  //     res.redirect(`/listings/${id}`)
  //   }))
    
  app.use((err, req, res, next)=>{
      let {statusCode = 500, message = "Something went wrong...!!!"} = err;
      res.status(statusCode).render("error.ejs", {err});
      // res.status(statusCode).send(message);
  })

  app.listen(8080, () => {
    console.log("server is listening to port 8080");
  });