import express from "express";
import {
  handleUserProfile,
  handleLogout,
  handleDel,
  handleEdit,
} from "../controllers/userController";

// User Router
const userRouter = express.Router();

// Call Controllers
userRouter.get("/logout", handleLogout);
userRouter.get("/edit", handleEdit);
userRouter.get("/del", handleDel);
userRouter.get("/:id", handleUserProfile);

export default userRouter;
