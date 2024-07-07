const express = require("express")
const router = express.Router()
const wrapAsync = require("../utils/wrapAsync.js")
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js")
const listingController = require("../controllers/listing.js")
const multer = require('multer')
const {storage} = require("../cloudConfig.js")
const upload = multer({ storage })
// server-side validation for listing schema using middleware

router
    .route("/")
    .get(wrapAsync(listingController.index)) //index Route
    .post(isLoggedIn, upload.single('listing[image]'), wrapAsync(listingController.createListing)); // Create Route
    // .post(upload.single('listing[image]'),(req,res)=>{
        // res.send(req.file); 
    // }) 

// New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
    .route("/:id")
    .get( wrapAsync(listingController.showListing))     // Show Route
    .put( isLoggedIn, isOwner, upload.single('listing[image]'), wrapAsync(listingController.updateListing)) // Update Route
    .delete( isLoggedIn, isOwner, wrapAsync(listingController.destroyListing)) //Delete Route

// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editListing));

// // Index Route
// router.get("/", wrapAsync(listingController.index));

// // Create Route
// router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.createListing));

// Show Route
// router.get("/:id", wrapAsync(listingController.showListing));

// Update Route
// router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing));

// Delete Route
// router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroyListing))

module.exports = router;