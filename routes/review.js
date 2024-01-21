const express = require("express")
const router = express.Router({mergeParams: true});//........>>>>imppppp/////creates new router object
const wrapAsync =  require("../utils/wrapAsync.js");
const expresserror = require("../utils/expresserror.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");// require this file from [ listing.js ]
const {validatereview, isLoggedIn, isReviewAuthor} = require("../middleware.js");

 
const reviewController = require("../controllers/reviews.js");// get from controller/reviews
//reviews
//post route

router.post("/",isLoggedIn, validatereview, wrapAsync(reviewController.createReview));


//delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync( reviewController.deleteReview));

module.exports = router;