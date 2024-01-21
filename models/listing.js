const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        url: String,
        filename: String,
    //     type: String,
    //     set: function (v) {
    //         // If v is falsy (null, undefined, empty string), use the default image URL
    //         if (!v) {
    //             return "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60";
    //         }
    //         // If v is an object with a url property, use the url as the image value
    //         if (typeof v === "object" && v.url) {
    //             return v.url;
    //         }
    //         // If v is already a string, use it as is
    //         return v;
    //     },
     },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",

        },
    ],
    owner:
     {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    // category: {
    //     type: String,
    //     enum:["mountains", "artic","farms","beaches","deserts","rooms",
    //     "campiing","caves","houseboates","caves","iconics","trending"];
    // }

});
 
listingSchema.post("findOneAndDelete", async (listing)=>{
 if(listing){
    await Review.deleteMany({_id : {$in : listing.reviews}});
 }

})

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;// export to [index.js]
