const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async(req, res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Created"); ///use to flash a message 
    res.redirect(`/listings/${listing._id}`);

};

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    // Perform the logic to delete the review with id `reviewId` for the listing with id `id`
    try {
        // Example using Mongoose to delete the review
        await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
        await Review.findByIdAndDelete(reviewId);
        req.flash("success", "Review Deleted"); ///use to flash a message 
        res.redirect(`/listings/${id}`);
    } catch (error) {
        // Handle any errors
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};