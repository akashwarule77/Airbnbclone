if(process.env.NODE_ENV != "production"){
    require("dotenv").config(); ////NPM PACKAGE FOR ACESESS THE .ENV FILE
}

 
 


const express = require("express");//require express 
const app = express(); //calling express
const mongoose = require("mongoose");//require mongoose
const path = require("path");//used for handling and transforming file paths. 
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");//help to create new templets
const expresserror = require("./utils/expresserror.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash")///use to flash a message 
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const { error } = require("console");


 
const dburl = process.env.ATLASTDB_URL;

main().then(()=>{ // calling the database and connect with data base [5]
    console.log("database is connected");
}).catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect(dburl);//method is used to connect to the MongoDB database specified in the mongo_url [4]
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs" , ejsMate);
app.use(express.static(path.join(__dirname,"/public")));//for access the static file..

const store = MongoStore.create({
    mongoUrl: dburl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24* 3600,
});
store.on("error",()=>{
    console.log("Session Store Error",err)
});

const sessionsOptions ={ ///use to flash a message 
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized:  true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 *1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

// app.get("/", (req,res)=>{  // creting get request on "/" we send the respons [2]
//     res.send("<h1> Welcome to Wanderlust</h1>");
// });

 



app.use(session(sessionsOptions));///use to flash a message 
app.use(flash());

app.use(passport.initialize());////////imp
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
    res.locals.success = req.flash("success");///use to flash a message 
    res.locals.error = req.flash("error");///use to flash a message 
    res.locals.currUser = req.user;
    
    next();
});

// app.get("/demouser", async (req, res)=>{ 
//     let fakeUser = new User({
//         email: "ak@gmail.com",
//         username: "akkku_123",
//     });

//     let resisterUser = await User.register(fakeUser, "akku123");
//     res.send(resisterUser);

// });

  
 
 
app.use("/listings",listingRouter);//where we  se the /listings there we use listings which export from the ./routes/listings.js
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.all("*", (req, res, next)=>{
    next(new expresserror(404, "Page Not Found....!"));
});

app.use((err, req, res, next)=>{
    let {statusCode=500, message="somthing went wrong"} = err;
    res.status(statusCode).render("err.ejs",{ message });
    //  res.status(statusCode).send(message);
});

//listening port
app.listen(8080,()=>{ //starts a server and listens for incoming HTTP requests on a specified port.[1]
    console.log("Server is running on port 8080")
})