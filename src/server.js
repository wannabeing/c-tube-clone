import express from "express";
import morgan from "morgan";
import session from "express-session";
import { localsMiddleware } from "./middlewares";
import MongoStore from "connect-mongo";
import flash from "express-flash";

import homeRouter from "./routers/homeRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import apiRouter from "./routers/apiRouter";

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
app.use(express.json());

// Express-Session 미들웨어 (Connect Session & MongoDB)
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
  })
);
// Use express-flash middleWare
app.use(flash());
// Use Middlewares.js (session INFO -> locals INFO)
app.use(localsMiddleware);

// Routers
app.use("/static", express.static("static"));
app.use("/uploads", express.static("uploads"));
app.use("/images", express.static("images"));
app.use("/", homeRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);
app.use("/api", apiRouter);

export default app;
