import express from 'express';
import { createSessionRequest, getMySessionRequests, getTherapistSessionRequests, updateSessionRequestStatus } from '../controllers/sessionController.js';

const sessionRouter = express.Router();

// Patient creates a session request
sessionRouter.post('/request', createSessionRequest);

// Patient fetches their session requests
sessionRouter.get('/my-requests', getMySessionRequests);

// Therapist fetches their session requests
sessionRouter.get('/therapist-requests', getTherapistSessionRequests);

// Therapist updates request status
sessionRouter.put('/update-status/:requestId', updateSessionRequestStatus);

export default sessionRouter;
