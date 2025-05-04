import express from 'express';

import { createSessionRequest, getMySessionRequests, getTherapistSessionRequests, updateSessionRequestStatus , acceptReq , rejectReq, getTherapistPatientRequests,setSession,getTherapistSessions , getRecentPatientSessions,getAllSessionsForPatient} from '../controllers/sessionController.js';

const sessionRouter = express.Router();

// Patient creates a session request
sessionRouter.post('/request', createSessionRequest);

// Patient fetches their session requests
sessionRouter.get('/my-requests', getMySessionRequests);

// Therapist fetches their session requests
sessionRouter.get('/therapist-requests', getTherapistSessionRequests);

// Therapist updates request status
sessionRouter.put('/update-status/:requestId', updateSessionRequestStatus);

//therapist accepts a session request
sessionRouter.post('/approve',acceptReq);

sessionRouter.post('/reject',rejectReq);

//therapist approved requests
sessionRouter.get("/gettherapistpatients", getTherapistPatientRequests);

//therapist set a session
sessionRouter.post("/addsession",setSession);


sessionRouter.get("/therapist-sessions",getTherapistSessions)

sessionRouter.get("/get_upcoming_sessions", getRecentPatientSessions)

sessionRouter.get("/get_all_sessions", getAllSessionsForPatient) 



export default sessionRouter;
