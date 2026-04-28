const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  room: String,
  author: String,
  message: String,
  time: String,
  date: String,
  seen: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Message", MessageSchema);