// const { getRecieversSocketId, io } = require('../lib/socket.js');
// const messageModel = require('../models/message.model');
// const userModel = require("../models/user.model.js");
// const cloudinary = require("cloudinary");

import { getRecieversSocketId, io } from '../lib/socket.js';
import messageModel from '../models/message.model.js';
import userModel from '../models/user.model.js';
import cloudinary from 'cloudinary';


export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await userModel.find({ _id: { $ne: loggedInUserId } });

        res.status(200).json({ filteredUsers });

    } catch (error) {
        console.log("error in getUsersForSidebar controller", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;

        const messages = await messageModel.find({
            $or: [
                { senderId: myId, recieverId: userToChatId },
                { senderId: userToChatId, recieverId: myId }
            ]
        });

        res.status(200).json({ messages });

    } catch (error) {
        console.log("error in getMessages controller", error.message);
        res.status(500).json({ message: "Internal server error" });

    }
}

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: recieverId } = req.params;
        const senderId = req.user._id;

        let imageUrl;

        if (image) {
            //upload image to cloudinary 
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new messageModel({
            senderId,
            recieverId,
            text,
            image: imageUrl
        });

        await newMessage.save();

        // real time messaging
        const recieversSocketId = getRecieversSocketId(recieverId);
        if (recieversSocketId) {
            io.to(recieversSocketId).emit("newMessage", newMessage);
        }

        res.status(200).json(newMessage);

    } catch (error) {
        console.log("error in sendMessage controller", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}
