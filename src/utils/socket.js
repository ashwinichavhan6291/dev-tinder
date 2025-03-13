const socketIo=require("socket.io");

 const initializeSocket=(server)=>{
    const io=socketIo(server,{
    cors:{
        origin : " http://localhost:5175",
    }
    
})
io.on("connection",(socket)=>{
    socket.on("joinchat",({userId,targetUserId,firstName})=>{
  const roomId=[userId,targetUserId].sort().join("-");

  socket.join(roomId);
    });
    socket.on("sendMessage",({userId,targetUserId,firstName,text})=>{
const roomId=[userId,targetUserId].sort().join("-");


io.to(roomId).emit("receivedMessage",{firstName , text})
    });
    socket.on("disconnect",()=>{});
})
return io;
}
module.exports=initializeSocket;