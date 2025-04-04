// const jwt = require("jsonwebtoken");
// const UserModel = require("../models/user.model.js");

import jwt from 'jsonwebtoken';
import UserModel from '../models/user.model.js';



const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: "unauthorized- no token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ message: "unauthorized- token expired or invalid" });
        }

        const user = await UserModel.findById(decoded._id).select("-password");

        if (!user) {
            return res.status(401).json({ message: "unauthorized- user not found" });
        }

        req.user = user;
        next();

    } catch (error) {
        console.log("error in auth middleware:", error.message);
        return res.status(500).json({ message: "internal server error" });
    }
}

// module.exports = authMiddleware;
export default authMiddleware;
