const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatlog = new Schema(
    {
        senderId: { type: String },
        role: { type: String },
        message: { type: String },
    },
    {
        timestamps: true,
    }
);

const Chatlog = mongoose.model("chatlog", chatlog, "chatlog");

module.exports = Chatlog;
