import express from "express";
import {
  handleWatch,
  handleEdit,
  handleDel,
  handleUpload,
} from "../controllers/vidoeController";

// Video Router
const videoRouter = express.Router();

// Call Controllers

videoRouter.get("/:id(\\d+)", handleWatch);
videoRouter.get("/:id(\\d+)/edit", handleEdit);
videoRouter.get("/:id(\\d+)/del", handleDel);
videoRouter.get("/upload", handleUpload);
export default videoRouter;
