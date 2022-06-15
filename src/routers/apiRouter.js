import express from "express";
import {
  handleCreateViews,
  handleCreateComment,
} from "../controllers/videoController";

// API Router
const apiRouter = express.Router();

// Call Controllers
apiRouter.post("/videos/:id([0-9a-f]{24})/views", handleCreateViews);
apiRouter.post("/videos/:id([0-9a-f]{24})/comment", handleCreateComment);

export default apiRouter;
