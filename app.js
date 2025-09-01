require("dotenv").config();
const express = require("express");
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/chatapp")
const app = express();
const http = require("http").Server(app);
const userRouter = require("./routes/userRoute");
const user = require("./models/userModel");
app.use('/', userRouter);

const io = require("socket.io")(http);
var usp = io.of("/user-namespace");
usp.on("connection",async (socket) => {
    console.log("User connected to user namespace");
    const userId = socket.handshake.auth.token;
    await user.findOneAndUpdate({_id: userId}, {is_online: '1'});
    socket.broadcast.emit("getOnlineUser", { user_id:userId});

    socket.on("disconnect", async () => {
        console.log("User disconnected from user namespace");
        await user.findOneAndUpdate({_id: userId}, {is_online: '0'});
        socket.broadcast.emit("getOfflineUser", { user_id:userId});
    });
});
http.listen(3000, () => {
    console.log("Server is running on port 3000");
});