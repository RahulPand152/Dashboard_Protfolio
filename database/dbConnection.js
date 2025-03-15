import mongoose from "mongoose";

const dbConnection = ()=>{

    mongoose.connect(process.env.MONGO_URI,{
        dbName:"PORTFOLIO"
    }).then(()=>{
        console.log("Connected to database")

    }).catch((error)=>{
        console.log(`database connection error ${error}`)
    })
}

export default dbConnection