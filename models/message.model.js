// const mongoose = require('mongoose');
import mongoose from 'mongoose';


const messageSchema = mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    recieverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    text: {
        type: String
    },

    image: {
        type: String
    }
}, { timestamps: true });

const messageModel = mongoose.model('Message', messageSchema);

// module.exports = messageModel;
export default messageModel;
