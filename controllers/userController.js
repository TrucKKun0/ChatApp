const userModel = require("../models/userModel");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const chatModel = require("../models/chatModel");


const registerLoad = async(req,res)=>{

    try {
        res.render('register');
    } catch (error) {
        console.error("Error rendering register page:", error);
        res.status(500).send("Internal Server Error");
    }

}

const register = async (req, res) => {
    try {
        

        const name = req.body.name || req.body.username; // fallback
        const email = req.body.email;
        const password = req.body.password;

        if (!name || !email || !password) {
            return res.render('register', { message: "All fields are required" });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashPassword,
            image: req.file ? 'images/' + req.file.filename : null
        });

        await user.save();
        res.render('register', { message: "Registration Successful" });

    } catch (error) {
        console.error("Registration error:", error);
        res.render('register', { message: error.message });
    }
};

const loadLogin = async(req,res)=>{

    try {
        res.render('login');
    } catch (error) {
        console.error("Error rendering login page:", error);
        res.status(500).send("Internal Server Error");
    }

};
const loadDashboard = async(req,res)=>{

    try {
        var users = await userModel.find({_id:{ $nin: req.session.user._id }})
        res.render('dashboard',{user:req.session.user, users});
    } catch (error) {
        console.error("Error rendering dashboard page:", error);
        res.status(500).send("Internal Server Error");
    }
};
const logout = async(req,res)=>{

    try {
        req.session.destroy();
        res.redirect('/');
        
    } catch (error) {
        console.error("Error logging out:", error);
        res.status(500).send("Internal Server Error");
    }

};
const login = async(req,res)=>{

    try {
        const {email,password} = req.body;
        const userData = await User.findOne({email})
        if(userData){
            const isMatch = await bcrypt.compare(password, userData.password);
            if(isMatch){
                req.session.user = userData;
                res.redirect('/dashboard');
            }else{
                res.render('login', { message: "Invalid Credentials" });
            }
        }else{
            res.render('login', { message: "Login Successful" });
        }
        
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).send("Internal Server Error");
    }
};
const deleteChat = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).send({ success: false, msg: "Chat ID is required" });
        }

        // Find and delete the chat
        const deletedChat = await chatModel.findByIdAndDelete(id);
        if (!deletedChat) {
            return res.status(404).send({ success: false, msg: "Chat not found" });
        }

        res.status(200).send({ success: true, msg: "Chat deleted successfully" });
    } catch (error) {
        console.error("Error deleting chat:", error);
        res.status(500).send({ success: false, msg: error.message });
    }
}
const updateChat = async (req, res) => {
    try {
        const { id, message } = req.body;
        if (!id || !message) {
            return res.status(400).send({ success: false, msg: "Chat ID and message are required" });
        }

        // Find and update the chat
        const updatedChat = await chatModel.findByIdAndUpdate(
            id,
            { message: message },
            { new: true }
        );
        if (!updatedChat) {
            return res.status(404).send({ success: false, msg: "Chat not found" });
        }

        res.status(200).send({ success: true, msg: "Chat updated successfully", data: updatedChat });
    } catch (error) {
        console.error("Error updating chat:", error);
        res.status(500).send({ success: false, msg: error.message });
    }
}
const saveChat = async (req, res) => {
try{
    const {sender_id,receiver_id,message} = req.body;
    if(!sender_id || !receiver_id || !message){
        return res.status(400).send({success:false,msg:"All fields are required"});
    }
    const chat = new chatModel({
        sender_id,
        receiver_id,
        message
    });
    const newChat= await chat.save();
    res.status(200).send({success:true,msg:"Chat saved successfully",data:newChat});
}catch(error){
    res.status(500).send({success:false,msg:error.message});

    }
}
module.exports = {
    registerLoad,
    register,
    loadLogin,
    loadDashboard,
    logout,
    login,
    saveChat,
    deleteChat,
    updateChat
};