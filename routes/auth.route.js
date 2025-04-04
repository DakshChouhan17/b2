// const express = require('express');
// const router = express.Router();
// const authController = require('../controllers/auth.controller.js');
// const authMiddleware = require ("../middlewares/auth.middleware.js");

import express from 'express';
const router = express.Router();
import { register, login, logout, update, checkAuth } from '../controllers/auth.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';



router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.put("/update", authMiddleware, update);
router.get("/check", authMiddleware, checkAuth);

// module.exports = router;
export default router;

