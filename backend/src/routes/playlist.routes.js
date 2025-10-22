import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { createPlaylist, addProblemToPlaylist, deletePlaylist, removeProblemInPlaylist, getAllListDetails, getPlaylistDetails } from '../controllers/playlist.controller.js';

const playlistRoutes = express.Router();

playlistRoutes.get("/", authMiddleware, getAllListDetails);

playlistRoutes.get("/:playlistId", authMiddleware, getPlaylistDetails);

playlistRoutes.post("/create", authMiddleware, createPlaylist);

playlistRoutes.post("/:playlistId/add-problem", authMiddleware, addProblemToPlaylist);

playlistRoutes.delete("/:playlistId", authMiddleware, deletePlaylist);

playlistRoutes.delete("/:playlistId/remove-problem/:problemId", authMiddleware, removeProblemInPlaylist);




export default playlistRoutes;