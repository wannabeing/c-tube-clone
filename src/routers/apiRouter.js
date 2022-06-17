import express from "express";
import {
  handleCreateViews,
  handleCreateComment,
  handleVideoLikes,
} from "../controllers/videoController";

// API Router
const apiRouter = express.Router();

const VIDEO_PATH = "/videos/:id([0-9a-f]{24})/";
// Call Controllers
apiRouter.post(VIDEO_PATH + "views", handleCreateViews);
apiRouter.post(VIDEO_PATH + "comment", handleCreateComment);
apiRouter.post(VIDEO_PATH + "likes", handleVideoLikes);
export default apiRouter;
