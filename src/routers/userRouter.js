import express from "express";
import {
  handleUserProfile,
  handleLogout,
  handleDel,
  handleGetEdit,
  handlePostEdit,
  handleGithubLogin,
  handleGithubCallback,
  handleKakaoLogin,
  handleKakaoCallback,
  handleChangePw,
} from "../controllers/userController";
import { redirectLogin, redirectHome, multerAvatars } from "../middlewares";

// User Router
const userRouter = express.Router();

// Call Controllers
userRouter.get("/logout", redirectLogin, handleLogout);
userRouter
  .route("/edit")
  .all(redirectLogin)
  .get(handleGetEdit)
  .post(multerAvatars.single("avatar"), handlePostEdit);
userRouter.post("/change-pw", redirectLogin, handleChangePw);
userRouter.get("/del", handleDel);
userRouter.get("/:id", handleUserProfile);
userRouter.get("/github/login", redirectHome, handleGithubLogin);
userRouter.get("/github/callback", redirectHome, handleGithubCallback);
userRouter.get("/kakao/login", redirectHome, handleKakaoLogin);
userRouter.get("/kakao/callback", redirectHome, handleKakaoCallback);

export default userRouter;
