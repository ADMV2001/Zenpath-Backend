import express from 'express';
import { createSessionRequest, getMySessionRequests, getTherapistSessionRequests, updateSessionRequestStatus , acceptReq , rejectReq, getTherapistPatientRequests,setSession,getTherapistSessions , getRecentPatientSessions,getAllSessionsForPatient,getSingleSession,updateSessionState,prevSessions,finishSession,getPatientTherapist,acceptSession, deleteSession,getReccentSessions,getSessionHours,getPendingSessionCount} from '../controllers/sessionController.js';

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

sessionRouter.post("/getSingleSession",getSingleSession)

sessionRouter.post("/updateSessionState",updateSessionState);

sessionRouter.get("/prevSessions",prevSessions);

sessionRouter.post("/finishSession",finishSession)

sessionRouter.get("/getacceptedReqs",getPatientTherapist);

sessionRouter.post("/accept_session_request", acceptSession)

sessionRouter.delete("/delete_session_request/:id", deleteSession)

sessionRouter.get("/getReccentSessions", getReccentSessions)

sessionRouter.get("/getsessionhours", getSessionHours)

sessionRouter.get("/getpending_sessions", getPendingSessionCount)


export default sessionRouter;
