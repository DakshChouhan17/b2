// const userModel = require("../models/user.model.js");
// const bcrypt = require("bcryptjs");
// const generateAuthToken = require("../lib/utils.js");
// const claudinary = require("../lib/cloudinary.js");

import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import  generateAuthToken  from "../lib/utils.js";
import claudinary from "../lib/cloudinary.js";


export const register = async (req, res, next) => {
        console.log(req.body);
    const { email, password, fullname } = req.body;

    try {
        if (!email || !password || !fullname) {
            return res.status(400).json({ message: "all fields are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "password must be atleast 6 charecter" });

        }
        const user = await userModel.findOne({ email });

        if (user) {
            return res.status(400).json({ message: "user already exsist" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);


        const newUser = new userModel({
            fullname: fullname,
            email: email,
            password: hashedPassword
        });

        if (newUser) {
            const token = generateAuthToken(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullname: newUser.fullname,
                email: newUser.email,
                // password: newUser.password,
                profilePic: newUser.profilePic,
                token: token
            });

        } else {
            res.status(400).json({ message: "invalid UserData" });
        }
    } catch (error) {
        console.log("error in register controller", error.message);
        res.status(500).json({ message: "Internal server error" });
    }

}

export const login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: "all fields are required" });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "invalid email or password" });
        }

        const token = generateAuthToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            profilePic: user.profilePic,
            token: token
        });
    } catch (error) {
        console.log("error in login controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const logout = async (req, res, next) => {
    try {
        res.cookie("token", "", { maxAge: 0 });
        res.status(200).json({ message: "logout successfully" });
    } catch (error) {
        console.log("error in logout controller", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const update = async (req, res, next) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

        if (!profilePic) {
            return res.status(400).json({ message: "profilePic is required" });
        }

        const uploadResponse = await claudinary.uploader.upload(profilePic);
        const updatedUser = await userModel.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true }).select("-password");

        res.status(200).json(updatedUser);

    } catch (error) {
        console.log("error in update controller", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const checkAuth = async (req, res, next) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("error in checkAuth controller", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}