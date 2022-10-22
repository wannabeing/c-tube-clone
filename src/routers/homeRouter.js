import express from "express";
import {
  handleGetJoin,
  handlePostJoin,
  handleGetLogin,
  handlePostLogin,
} from "../controllers/userController";
import {
  handleHome,
  handleNotFound,
  handleSearch,
} from "../controllers/videoController";
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
// 404 Controller
homeRouter.use((req, res) => {
  return res.status(404).render("404", { pageTitle: "Not Found 🥲" });
});
export default homeRouter;
