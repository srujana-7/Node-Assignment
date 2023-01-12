
const express=require('express')
const cookieParser =require( 'cookie-parser');

const mongoose =require('mongoose');
const path=require('path')
const multer = require('multer')

const userRouter= require('./routes/user')
const fileRouter=require( './routes/file')
const dotenv =require( 'dotenv');
dotenv.config()

const app= express();
app.use(express.json())
app.use(cookieParser());

app.listen(5000, () => {
   // connect();
    console.log("Connected to Server");
  });

  const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
    } catch (err) {
        console.log(err)
    }
  }
  connectDB()
  
  mongoose.connection.on("disconnected", () => {
    console.log("mongoDB disconnected!");
  });
  
  mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
  
  })
  
  mongoose.connection.on('error', err => {
    console.log(err)
   
  })

  app.use(userRouter)
  app.use(fileRouter)

  app.use("/uploads", express.static("uploads"));

  