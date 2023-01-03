import { Schema, model, models } from "mongoose";
import mongoose from "mongoose";
import techStack from "../utils/techStack";

const teamSchema = new Schema({
  teamName: {
    type: String,
    required: true,
  },
  requiredTeamSize: {
    type: Number,
    required: true,
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  memberIds: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    required: false,
    default: [],
  },
  requiredTechnologies: [
    {
      type: String,
      enum: techStack,
      required: false,
    },
  ],
  requirementLine1: {
    type: String,
    required: false,
    default: "",
  },
  requirementLine2: {
    type: String,
    required: false,
    default: "",
  },
  requirementLine3: {
    type: String,
    required: false,
    default: "",
  },
  description: {
    type: String,
    required: false,
    default: "",
  },
  sentRequestCount: {
    type: Number,
    default: 0,
  },
  receivedRequestCount: {
    type: Number,
    default: 0,
  },
});

const Team = models.Team || model("Team", teamSchema);

export default Team;
