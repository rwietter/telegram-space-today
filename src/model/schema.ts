import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  chatId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Chatlist = mongoose.model('chatlist', chatSchema);