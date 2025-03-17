const express=require("express");
const chatRouter=express.Router();
const { chat } = require("../models/chat");
const { userAuth } = require("../middlewares/auth");



chatRouter.get("/chat/:targetUserId", userAuth , async(req,res)=>{
    const userId=req.user._id;
    const {targetUserId}=req.params;
    try{
       
     const chats=await chat.findOne({
            participants : {$all : [userId,targetUserId]},
        }).populate({
            path : "messages.senderId",
            select : "firstName lastName",
        })
        if(!chats){
          chats=new chat({
            participants:[userId,targetUserId],
            messages:[],
          })
          await chats.save();
    // res.send(chats);
    
        }
        res.json(chats);
    }
    catch(err){
       console.log(err);
    }
  
})

module.exports=chatRouter;