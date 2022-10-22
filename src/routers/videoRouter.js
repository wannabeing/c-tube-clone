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
  handleNotFound,
} from "../controllers/videoController";
import { redirectLogin, multerVideos } from "../middlewares";

// Video Router
const videoRouter = express.Router();

// Call Controllers
videoRouter.route("/:id([0-9a-f]{24})").get(handleWatch);
videoRouter.get("/:id([0-9a-f]{25,300})", handleNotFound);
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
// 404 Controller
videoRouter.use((req, res) => {
  return res.status(404).render("404", { pageTitle: "Not Found 🥲" });
});
export default videoRouter;
