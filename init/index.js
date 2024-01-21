//////this file for intiolization/////////

const mongoose = require("mongoose");
const initData = require("./data.js");///require from [data.js]
const Listing = require("../models/listing.js");// require this file from [ listing.js ]


const MONGO_URL = "mongodb://127.0.0.1:27017/Wanderlust";//connecting to database 

main().then(()=>{ // calling the database and connect with data base 
    console.log("database is connected");
}).catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect(MONGO_URL);//method is used to connect to the MongoDB database specified in the mongo_url [4]
}

const initDB = async () =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj, owner: "659e49f944f5a30c06ff035f"}));
    await Listing.insertMany(initData.data);//to accese the data from[data.js]
    console.log("data was initialized..");
}

initDB();//call the function of initDB