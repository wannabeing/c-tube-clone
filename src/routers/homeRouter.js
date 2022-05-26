import express from "express";
import { handleJoin, handleLogin } from "../controllers/userController";
import { handleHome, handleSearch } from "../controllers/vidoeController";

// Home Router
const homeRouter = express.Router();

// Call Controllers
homeRouter.get("/", handleHome);
homeRouter.get("/join", handleJoin);
homeRouter.get("/login", handleLogin);
homeRouter.get("/search", handleSearch);

export default homeRouter;
