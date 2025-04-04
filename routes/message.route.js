// const express = require('express');
// const router = express.Router();
// const messageController = require("../controllers/message.controller.js");
// const authMiddleware = require("../middlewares/auth.middleware.js");

import express from 'express';
const router = express.Router();
import { getMessages, getUsersForSidebar, sendMessage } from '../controllers/message.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';


router.get("/users", authMiddleware, getUsersForSidebar);
router.get("/:id", authMiddleware, getMessages);
router.post("/send/:id", authMiddleware, sendMessage);

// module.exports = router;

export default router;
