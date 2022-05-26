import express from "express";
import morgan from "morgan";

import homeRouter from "./routers/homeRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

const app = express();

// X-Powered-by Setting (Header)
app.disable("x-powered-by");

// Morgan log Middleware
const logger = morgan("dev");
app.use(logger);

// Routers
app.use("/", homeRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

// Pug (Template Engine) View Engine Setting
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");

app.listen(4000, () => {
  console.log(`✅ Server listening on port http://localhost:4000`);
});
