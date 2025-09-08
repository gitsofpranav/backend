// require('dotenv').config({path: '/.env'})
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

import connectDB from './db/index.js';
import { app } from './app.js';  // import app from app.js

// Connect to MongoDB & start server
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at PORT: ${process.env.PORT || 8000}`);
    });
  })
  .catch((err) => {
    console.log("MONGODB CONNECTION FAILED", err);
  });










































/*
import express from "express";
const app = express();

;(async () => {
    try{
      await mongoose.connect(`${process.env.MONGODB_URI}/${DB_MANE}`)
      app.on("error", (error)=>{
        console.log("ERROR",error)
        throw error
      })
      app.listen(process.env.PORT, () =>{
        console.log(`App is listening on port $ {process.env.PROT}`);
      })
    }catch (error){
        console.error("ERROR : ", error)
        throw error
    }
})()
*/