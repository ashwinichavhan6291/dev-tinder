const socketIo=require("socket.io");
const { chat } = require("../models/chat");
const crypto=require("crypto");
 const initializeSocket=(server)=>{
    const secreateRoomId=(userId,targetUserId)=>{
        return crypto.createHash("sha256").update([userId,targetUserId].sort().join("-")).digest("hex");
    }
    const io=socketIo(server,{
    cors:{
        origin : " http://localhost:5173",
    }
    
})
io.on("connection",(socket)=>{
    socket.on("joinchat",({userId,targetUserId,firstName})=>{
  const roomId=secreateRoomId(userId,targetUserId);
  console.log("rom id" ,roomId);

  socket.join(roomId);
    });
    socket.on("sendMessage" , async({userId,targetUserId,firstName,lastName,text})=>{

 try{
    const roomId=secreateRoomId(userId,targetUserId);
    console.log(firstName + " " + text);
 let chats=await chat.findOne({
     participants : {$all :[userId,targetUserId]}
 });
 if(!chats){
     chats=new chat({
         participants : [userId,targetUserId],
         messages:[]
     })
    }
     chats.messages.push({
         senderId: userId,
     text
     })
    
     await chats.save();
     io.to(roomId).emit("receivedMessage",{firstName ,lastName, text})
 }
 
 catch(err){
     console.log(err);
 }

    });


  
socket.on("disconnect",()=>{});
})
return io;
}
module.exports=initializeSocket;