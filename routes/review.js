const express = require("express");
const router = express.Router({ mergeParams: true }); //// merge perent with child
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/review.js");

// server-side validation for review schema using middleware

// POST Reviews route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// DELETE Review route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;