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
videoRouter.get("/:id([0-9a-f]{24})", handleWatch);
videoRouter.route("/upload").get(handleGetUpload).post(handlePostUpload);
videoRouter
  .route("/:id([0-9a-f]{24})/edit")
  .get(handleGetEdit)
  .post(handlePostEdit);
videoRouter.get("/:id([0-9a-f]{24})/delete", handleDel);
export default videoRouter;
