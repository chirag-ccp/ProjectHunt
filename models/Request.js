import { Schema, model, models } from "mongoose";
import mongoose from "mongoose";

const requestSchema = new Schema({
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    required: true,
  },
  teamName: {
    type: String,
    required: true,
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  senderName: {
    type: String,
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiverName: {
    type: String,
    required: true,
  },
  senderType: {
    type: String,
    enum: ["admin", "member"],
    required: true,
  },
  status: {
    type: String,
    enum: ["live", "accepted", "rejected", "withdrawn"],
    required: true,
  },
});

const Request = models.Request || model("Request", requestSchema);

export default Request;
