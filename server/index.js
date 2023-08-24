const express=require("express");
const cors =require("cors");
const mongoose=require("mongoose");
require("dotenv").config();
const app=express();
const userRoutes=require("./routes/userRoutes.js");
const messagesRoute=require("./routes/messagesRoute.js");
const socket=require("socket.io");

app.use(cors());
app.use(express.json());



mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("DB Connection successfull");
}).catch((err)=>{
    console.log(err.message + "hi");
})
app.use("/api/auth",userRoutes);
app.use("/api/messages",messagesRoute);


const server=app.listen(process.env.PORT,()=>{
    console.log(`server started at port ${process.env.PORT}`);
})

const io=socket(server,{
    cors:{
        origin:["https://chat-app-final-frontend.vercel.app"],
        methods:["POST","GET"],
        Credentials:true
    }
})

global.onlineUsers=new Map();

io.on("connection",(socket)=>{
    global.chatSocket=socket;
    socket.on("add-user",(userId)=>{
        onlineUsers.set(userId,socket.id);
    });

    socket.on("send-msg",(data)=>{


        const sendUserSocket =onlineUsers.get(data.to);
        if(sendUserSocket){
            socket.to(sendUserSocket).emit("msg-recieve",data.message);
        }
    })
})
