import express from "express";
import {
  handleUserProfile,
  handleLogout,
  handleDel,
  handleEdit,
  handleGithubLogin,
  handleGithubCallback,
  handleKakaoLogin,
  handleKakaoCallback,
} from "../controllers/userController";

// User Router
const userRouter = express.Router();

// Call Controllers
userRouter.get("/logout", handleLogout);
userRouter.get("/edit", handleEdit);
userRouter.get("/del", handleDel);
userRouter.get("/:id", handleUserProfile);
userRouter.get("/github/login", handleGithubLogin);
userRouter.get("/github/callback", handleGithubCallback);
userRouter.get("/kakao/login", handleKakaoLogin);
userRouter.get("/kakao/callback", handleKakaoCallback);

export default userRouter;
