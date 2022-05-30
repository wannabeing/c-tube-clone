import express from "express";
import {
  handleGetJoin,
  handlePostJoin,
  handleGetLogin,
  handlePostLogin,
} from "../controllers/userController";
import { handleHome, handleSearch } from "../controllers/videoController";

// Home Router
const homeRouter = express.Router();

// Call Controllers
homeRouter.get("/", handleHome);
homeRouter.get("/search", handleSearch);
homeRouter.route("/join").get(handleGetJoin).post(handlePostJoin);
homeRouter.route("/login").get(handleGetLogin).post(handlePostLogin);

export default homeRouter;
