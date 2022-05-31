import express from "express";
import morgan from "morgan";
import session from "express-session";
import { localsMiddleware } from "./middlewares";

import homeRouter from "./routers/homeRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

const app = express();

// Pug (Template Engine) View Engine Setting
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");

// X-Powered-by Setting (Header)
app.disable("x-powered-by");

// Morgan 로그 미들웨어
const logger = morgan("dev");
app.use(logger);

// form Data 파싱 미들웨어
app.use(express.urlencoded({ extended: true }));

// Express-Session 미들웨어
app.use(
  session({
    secret: "Hello",
    resave: true,
    saveUninitialized: true,
  })
);

// Use Middlewares.js
app.use(localsMiddleware);

// Routers
app.use("/", homeRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

export default app;
