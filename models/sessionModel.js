import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  therapistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "therapist",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "patient",
    required: true,
  },
  sessionDate: {
    type: String
  },
  sessionTime: {
    type: String
  },
  state:{
    type: String
  },
  roomName:{
    type: String
  },
  sessionDuration : {
    type: String
  },
  sessionNote : {
    type: String
  },
  sessionType: {
    type: String
  }
});

const Session = mongoose.model("Session", sessionSchema);

export default Session;
