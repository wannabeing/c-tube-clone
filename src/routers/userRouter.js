import express from "express";
import {
  handleUserProfile,
  handleLogout,
  handleGetEdit,
  handlePostEdit,
  handleGithubLogin,
  handleGithubCallback,
  handleKakaoLogin,
  handleKakaoCallback,
  handleGetChangePw,
  handlePostChangePw,
  handleResetAvatar,
  handleNaverCallback,
  handleNaverLogin,
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
userRouter
  .route("/change-pw")
  .all(redirectLogin)
  .get(handleGetChangePw)
  .post(handlePostChangePw);
userRouter.get("/:id([0-9a-z]{24})", handleUserProfile);
userRouter.get("/github/login", redirectHome, handleGithubLogin);
userRouter.get("/github/callback", redirectHome, handleGithubCallback);
userRouter.get("/kakao/login", redirectHome, handleKakaoLogin);
userRouter.get("/kakao/callback", redirectHome, handleKakaoCallback);
userRouter.get("/naver/login", redirectHome, handleNaverLogin);
userRouter.get("/naver/callback", redirectHome, handleNaverCallback);
userRouter.post("/avatar_reset", redirectLogin, handleResetAvatar);

export default userRouter;
