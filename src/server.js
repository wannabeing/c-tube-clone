import express from "express";
import morgan from "morgan";

const app = express(); // express application
const logger = morgan("dev"); // Morgan 로그 미들웨어

const finalWare = (req, res) => {
  return res.send("끝!");
};

app.use(logger); // 전역 미들웨어
app.get("/", finalWare); // GET request

app.listen(4000, () => {
  console.log(`✅ Server listening on port http://localhost:4000`);
});
