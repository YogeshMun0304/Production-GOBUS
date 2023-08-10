const router= require ('express').Router();
const User = require('../models/usersModel');
const bcrypt = require("bcryptjs");
const { response } = require('express');
const jwt=require('jsonwebtoken')
const authMiddleware =require("../middlewares/authMiddleware")

router.post('/register',async(req,res)=>{
    try{
            const existingUser = await User.findOne({email: req.body.email});
            if(existingUser){
                return res.send({
                    message: 'User already exists',
                    success: false,
                    data: null,
                })
            }
            const hashedPassword = await bcrypt.hash(req.body.password,10);
            req.body.password=hashedPassword;
            const newUser = new User(req.body)
            await newUser.save();
            res.send({
                message: "user created successfully",
                success : true,
                data :null
            });

    }catch(error){
        res.send({
            message: error.message,
                success : false,
                data :null
        })
    }
})

router.post('/login', async(req,res)=>{
    // console.log(req.body())
    try
    {
        const userExists=await User.findOne({email:req.body.email});
        if(!userExists)
        {
            return res.send({
                message:"User does not exist",
                success: false,
                data: null
            });
        }
        const passwordMatch=await bcrypt.compare(
            req.body.password, userExists.password
        );
        if(!passwordMatch)
        {
            return res.send({
                message:"Incorrect password",
                success: false,
                data: null
            });
        }
const token=jwt.sign({
    email:userExists.email, userId: userExists._id},
    process.env.jwt_secret, 
    {
        expiresIn: "1d"
    }
);
res.send({
    message: "User logged in",
    success: true,
    data: token,
})

    }catch(error)
    {
        res.send({
       message: error.message,
       success: false,
       data: null})
    }
});
router.post("/get-user-by-id", authMiddleware ,async(req,res)=>{
    try {
        const user = await User.findById(req.body.userId);
        res.send({
            message: "User fetched succesfully",
            success: true,
            data:user
        });
    } catch (error) {
        res.send({
        message: error.message,
        success: false,
        data:null,
    });
    }

})
router.post("/get-all-users", authMiddleware, async (req, res) => {
    try {
      const users = await User.find({});
      res.send({
        message: "Users fetched successfully",
        success: true,
        data: users,
      });
    } catch (error) {
      res.send({
        message: error.message,
        success: false,
        data: null,
      });
    }
  });
  
  // update user
  
  router.post("/update-user-permissions", authMiddleware, async (req, res) => {
    try {
      await User.findByIdAndUpdate(req.body._id, req.body);
      res.send({
        message: "User permissions updated successfully",
        success: true,
        data: null,
      });
    } catch {
      res.send({
        message: error.message,
        success: false,
        data: null,
      });
    }
  });

module.exports = router