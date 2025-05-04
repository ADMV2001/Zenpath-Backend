import SessionRequest from '../models/sessionRequestModel.js';
import Session  from '../models/sessionModel.js';

export async function createSessionRequest(req, res) {
  try {
    const { therapistId } = req.body;
    const userId = req.user.id;

    const existing = await SessionRequest.findOne({ userId, therapistId, status: "Pending" });
    if (existing) {
      return res.status(400).json({ message: "You already have a pending request for this session" });
    }

    const sessionRequest = new SessionRequest({ userId, therapistId });
    await sessionRequest.save();
    res.status(201).json(sessionRequest);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function getMySessionRequests(req, res) {
    try {
      const userId = req.user.id;
      const requests = await SessionRequest.find({ userId }).populate('therapistId');
      res.json(requests);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
}

export async function getTherapistSessionRequests(req, res) {
    try {
      const therapistId = req.user.id;
      const requests = await SessionRequest.find({ therapistId,status:"Pending" }).populate('userId');
      res.json(requests);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
}

export async function updateSessionRequestStatus(req, res) {
    try {
      const { requestId } = req.params;
      const { status } = req.body; // "Accepted" or "Rejected"

      if (!["Accepted", "Rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status." });
      }

      const request = await SessionRequest.findByIdAndUpdate(
        requestId,
        { status },
        { new: true }
      );
      res.json(request);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
}

export async function acceptReq(req, res) {
  if (req.user == null) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { requestId } = req.body;

  try {
    await SessionRequest.updateOne(
      { _id: requestId },
      { $set: { status: "Accepted" } }
    );
    return res.json({ message: "Request accepted successfully!" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export async function rejectReq(req, res) {
  if (req.user == null) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const { requestId } = req.body;
  try {
    await SessionRequest.updateOne(
      { _id: requestId },
      { $set: { status: "Rejected" } }
    );
    return res.json({ message: "Request Rejected Successfully!" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export async function getTherapistPatientRequests(req, res) {
  try {
    const therapistId = req.user.id;
    const requests = await SessionRequest.find({ therapistId,status:"Accepted" }).populate('userId');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function setSession(req, res) {
  if (req.user == null) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
    const therapistId = req.user.id;
    const { userId,sessionDate,sessionTime,sessionDuration,sessionType,sessionNote} = req.body;
    const roomName="Room"+Date.now();
    const state="Pending";
    console.log("therapistId",therapistId);
    console.log("duration",sessionDuration);
    console.log("session data",userId,sessionDate,sessionTime,sessionDuration,sessionType,sessionNote,roomName,state);

    const existingSession = await Session.findOne({
      therapistId,
      sessionDate,
      sessionTime
    });

    if (existingSession) {
      return res.status(400).json({ message: "You already have a session at this time" });
    }else{
      try {
    const session = new Session({therapistId,userId,sessionDate,sessionTime,state,roomName,sessionDuration,sessionNote,sessionType });
    await session.save();
    res.status(201).json({ message: "Session Added" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
}
}


export async function getTherapistSessions(req,res){
  if (req.user == null) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const therapistId = req.user.id;
  try {
    const sessions = await Session.find({ therapistId }).sort({ sessionDate: 1, sessionTime: 1 }).populate('userId');
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}


export async function getRecentPatientSessions(req, res) {
  try {
    const userId = req.user.id; 
    const sessions = await Session.find({ userId , state: "Confirmed" || "Started"})
      .sort({ sessionDate: -1, sessionTime: -1 }) 
      .populate('therapistId', 'name email profilePicture'); 

    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: "Error fetching recent sessions." });
  }
}

export async function getAllSessionsForPatient(req, res){
  try{
    const userId = req.user.id; 
    const allSessions = await Session.find({ userId })
      .populate('therapistId', 'name email profilePicture').populate('userId', 'name email')
    res.json(allSessions); 
  }
  catch(err){
    res.status(500).json({ message: "Error fetching all sessions." });
  }
}

export async function getSingleSession(req, res){
  try {
    const { sessionId } = req.body;
    const session = await Session.findById(sessionId)
      .populate('userId').populate('therapistId');;
    if (!session) {
      return res.status(404).json({ message: "Session not found." });
    }
    res.json(session);
  }
  catch (err) {
    res.status(500).json({ message: "Error fetching session." });
  }
}


export async function updateSessionState(req, res){
  try {
    const { sessionId, state } = req.body;
    
    const session = await Session.findByIdAndUpdate(sessionId, { state }, { new: true });
    if (!session) {
      return res.status(404).json({ message: "Session not found." });
    }
    res.json(session);   
  }
  catch (err) {
    res.status(500).json({ message: "Error updating session state." });
  }
}

export async function prevSessions(req, res){
  try {
    const therapistId = req.user.id; 
    const state = "Started";
    const sessions = await Session.findOne({ therapistId,state }).populate('userId');
    if (!sessions) {
      res.json({isprevSession:false});
    }
    else{
      res.json({isprevSession:true,sessions});
    }
  }
  catch (err) {
    res.status(500).json({ message: "Error fetching recent sessions." });
  }
}

export async function finishSession(req, res){
  try {
    const { sessionId } = req.body;
    const state = "Finished";
    const session = await Session.findByIdAndUpdate(sessionId, { state }, { new: true });
    if (!session) {
      return res.status(404).json({ message: "Session not found." });
    }
    res.json(session);   
  }
  catch (err) {
    res.status(500).json({ message: "Error updating session state." });
  }
}