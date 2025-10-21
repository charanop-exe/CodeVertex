import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { getAllSubmissions, getSubmissionById, getSubmissionCountForProblem } from "../controllers/submission.controller.js";

const submissionRoutes = express.Router();

submissionRoutes.get("/get-all-submissions", authMiddleware, getAllSubmissions);

submissionRoutes.get("/get-submission/:problemId", authMiddleware, getSubmissionById);

submissionRoutes.get("/get-submission-count/:problemId", authMiddleware, getSubmissionCountForProblem);


export default submissionRoutes;