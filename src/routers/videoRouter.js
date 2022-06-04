import express from "express";
import {
  handleWatch,
  handleGetEdit,
  handlePostEdit,
  handleGetUpload,
  handlePostUpload,
  handleDelVideo,
} from "../controllers/videoController";
import { redirectLogin, multerVideos } from "../middlewares";

// Video Router
const videoRouter = express.Router();

// Call Controllers
videoRouter.get("/:id([0-9a-f]{24})", handleWatch);
videoRouter
  .route("/upload")
  .all(redirectLogin)
  .get(handleGetUpload)
  .post(multerVideos.single("video"), handlePostUpload);
videoRouter
  .route("/:id([0-9a-f]{24})/edit")
  .all(redirectLogin)
  .get(handleGetEdit)
  .post(handlePostEdit);
videoRouter.get("/:id([0-9a-f]{24})/delete", redirectLogin, handleDelVideo);
export default videoRouter;
