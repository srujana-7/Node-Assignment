


const express=require('express')
const user= require('../models/user')
const file=require("../models/file")
const jwt=require('jsonwebtoken')
const dotenv =require( 'dotenv');
dotenv.config()
const router = new express.Router()
//companyAuth


router.post("/user/add",  async (req, res) => {
    const user1 = new user(req.body);
    try {
      const saveduser = await user1.save();
      res.status(200).json(saveduser);
    } catch (err) {
      res.status(500).json(err.message);
    }
  });


router.post("/user/login",async(req,res)=>{
    try{
        const resUser= await user.findOne({name:req.body.name, password: req.body.password})
        if(!resUser)
        return res.status(404).send("Not found")

        const access_token = await resUser.generateAccessToken();
        const refresh_token = await resUser.generateRefreshToken();

        res.cookie("access_token", access_token, {
            expires: new Date(Date.now() + 2 * 3600 * 1000),
           // httpOnly: true, 
        });
          res.cookie("refresh_token", refresh_token, {
            expires: new Date(Date.now() + 24 * 3600 * 1000),
          //  httpOnly: true,   
          });


          const userDocs= await  file.find({userId: resUser._id})   
         
          res.status(200).json({"message": " your docs are", userDocs})
    }catch (err) {
        res.status(500).json(err.message);
      }
})


router.post("/user/logout",async(req,res)=>{
     
    try{
    const accessToken = req.cookies.access_token;
    const refreshToken = req.cookies.refresh_token;

    if(!accessToken || !refreshToken)
    return res.status(400).send("cannot logout or already logged out")    

    res.clearCookie("access_token");
    res.clearCookie("refresh_token");

    res.status(200).json("You logged out successfully.");
    }catch (err) {
    res.status(500).json(err.message);
  }
})


router.get("/user/getAll",async (req,res)=>{
 
    try {
        const users = await user.find({isArchived : false});
        res.status(200).json(users);
      } catch (err) {
        res.status(500).json(err.message);
      }
})


router.get("/user/getOne/:id", async (req, res) => {
    try {
      const res_user = await user.findById({_id:req.params.id, isArchived : false});
      res.status(200).json(res_user);
    } catch (err) {
      res.status(500).json(err.message);
    }
  });


router.put("/user/update/:id", async (req, res) => {
    try {
      const updateduser = await user.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updateduser);
    } catch (err) {
      res.status(500).json(err.message);
    }
  });


router.delete("/user/delete/:id",  async (req, res) => {
    try {
      await user.findByIdAndDelete(req.params.id);
      res.status(200).json(" deleted.");
    } catch (err) {
      res.status(500).json(err.message);
    }
  });

module.exports = router
//export { router as userRouter }