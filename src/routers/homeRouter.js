import express from "express";
import { all } from "express/lib/application";
import {
  handleGetJoin,
  handlePostJoin,
  handleGetLogin,
  handlePostLogin,
} from "../controllers/userController";
import { handleHome, handleSearch } from "../controllers/videoController";
import { redirectHome } from "../middlewares";

// Home Router
const homeRouter = express.Router();

// Call Controllers
homeRouter.get("/", handleHome);
homeRouter.get("/search", handleSearch);
homeRouter
  .route("/join")
  .all(redirectHome)
  .get(handleGetJoin)
  .post(handlePostJoin);
homeRouter
  .route("/login")
  .all(redirectHome)
  .get(handleGetLogin)
  .post(handlePostLogin);

export default homeRouter;
