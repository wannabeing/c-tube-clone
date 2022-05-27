import express from "express";
import morgan from "morgan";

// Import MongoDB & DB Model
import "./db";
import "./models/Video";

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

// Routers
app.use("/", homeRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

app.listen(4000, () => {
  console.log(`✅ Server listening on port http://localhost:4000`);
});
