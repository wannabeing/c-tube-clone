import express from "express";
import {
  handleWatch,
  handleGetEdit,
  handlePostEdit,
  handleDel,
  handleGetUpload,
  handlePostUpload,
} from "../controllers/videoController";

// Video Router
const videoRouter = express.Router();

// Call Controllers
videoRouter.get("/:id(\\d+)", handleWatch);
videoRouter.get("/:id(\\d+)/del", handleDel);
videoRouter.route("/upload").get(handleGetUpload).post(handlePostUpload);
videoRouter.route("/:id(\\d+)/edit").get(handleGetEdit).post(handlePostEdit);

export default videoRouter;
