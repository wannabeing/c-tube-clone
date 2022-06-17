import express from "express";
import {
  handleWatch,
  handleGetEdit,
  handlePostEdit,
  handleGetUpload,
  handlePostUpload,
  handleDelVideo,
  handleCreateVideo,
  handleDelComment,
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
  .post(
    multerVideos.fields([
      {
        name: "video",
        maxCount: 1,
      },
      {
        name: "thumb",
        maxCount: 1,
      },
    ]),
    handlePostUpload
  );
videoRouter
  .route("/:id([0-9a-f]{24})/edit")
  .all(redirectLogin)
  .get(handleGetEdit)
  .post(handlePostEdit);
videoRouter.route("/create").all(redirectLogin).get(handleCreateVideo);
videoRouter.get("/:id([0-9a-f]{24})/delete", redirectLogin, handleDelVideo);
videoRouter.get("/:id([0-9a-f]{24})/comment/del", handleDelComment);
export default videoRouter;
