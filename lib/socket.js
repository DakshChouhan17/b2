// const express = require("express");
// const http = require("http");
// const { Server } = require("socket.io");

import express from 'express';
import http from 'http';
import { Server } from 'socket.io';


const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"],
    },
});

//used to store online users
const useSocketMap = {};

function getRecieversSocketId(userId) {
    return useSocketMap[userId];
}

io.on("connection", (socket) => {
    console.log("A user Connected", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId) {
        useSocketMap[userId] = socket.id;

        //io.emit() is used to send event to all the connected users
        io.emit("getOnlineUsers", Object.keys(useSocketMap));
    }

    socket.on("disconnect", () => {
        console.log("A user disconnected", socket.id);

        delete useSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(useSocketMap));
    });
});

// module.exports = { app, server, io, getRecieversSocketId };
export { app, server, io, getRecieversSocketId };


