const express = require("express")
const router = express.Router();///ues to destucture the code using express Router
const wrapAsync =  require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");// require this file from [ listing.js ]
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listing.js");// get from controller/listing



const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

router.route("/")
.get( wrapAsync(listingController.index))//index route
.post( isLoggedIn,upload.single("listing[image]")
,validateListing ,//multer
 wrapAsync(listingController.renderCreateForm));//create route
 
// .post(upload.single("listing[image]"),(req,res)=>{
//     res.send(req.file);
// });
//new route
router.get("/new", isLoggedIn,listingController.renderNewForm);

 router.route("/:id")
 .get( wrapAsync(listingController.renderShowForm))// show route
//  .put(
//     isLoggedIn,
//     isOwner ,
//     upload.single("listing[image]"),
//     validateListing, 
//     wrapAsync(listingController.renderUpdateForm))//update route
router.route("/:id")
    .put(isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, wrapAsync(listingController.renderUpdateForm))


 .delete( isOwner, wrapAsync (listingController.renderDeleteForm));//delete route

//Edit router
router.get("/:id/edit",isLoggedIn ,isOwner, wrapAsync (listingController.renderEditForm));

module.exports = router;