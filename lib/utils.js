// const jwt = require("jsonwebtoken");
import jwt from 'jsonwebtoken';


const generateAuthToken = (_id, res) => {
    const token = jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.cookie("token", token, {
        httpOnly: true, // true means that the cookie cannot be accessed using JavaScript
        secure: process.env.NODE_ENV !== 'development', // true means that the cookie will only be sent on a secure connection
        sameSite: 'strict', // strict means that the cookie will only be sent in a first-party context
        maxAge: 7 * 24 * 60 * 60 * 1000 // cookie will expire after 7 days
    });
    return token;
}

// module.exports = generateAuthToken;
export default generateAuthToken;
