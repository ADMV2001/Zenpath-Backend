import SessionRequest from '../models/sessionRequestModel.js';

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

  
  

  
