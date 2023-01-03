import { Schema, model, models } from "mongoose";
import mongoose from "mongoose";
import techStack from "../utils/techStack";

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  headline: {
    type: String,
    required: false,
    default: "",
  },
  description: {
    type: String,
    required: false,
    default: "",
  },
  technologies: [
    {
      type: String,
      enum: techStack,
      required: false,
    },
  ],
  firstHighlight: {
    type: String,
    required: false,
    default: "",
  },
  secondHighlight: {
    type: String,
    required: false,
    default: "",
  },
  thirdHighlight: {
    type: String,
    required: false,
    default: "",
  },
  githubProfile: {
    type: String,
    required: false,
    default: "",
  },
  kaggleProfile: {
    type: String,
    required: false,
    default: "",
  },
  codechefProfile: {
    type: String,
    required: false,
    default: "",
  },
  codeforcesProfile: {
    type: String,
    required: false,
    default: "",
  },
  leetcodeProfile: {
    type: String,
    required: false,
    default: "",
  },
  contactNumber: {
    type: String,
    required: false,
    default: "",
  },
  teamIds: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Team",
    required: false,
    default: [],
  },
});

const User = models.User || model("User", userSchema);

export default User;
