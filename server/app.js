import dotenv from "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import userRouter from "./src/modules/auth/router.js";

const app = express();
const PORT = process.env.PORT;

// ` =========================
// ? Middlewares
// ` =========================
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);
app.use(cors());
// app.use(helmet());
app.use(morgan("dev"));
// ` =========================
// ? Middlewares
// ` =========================

app.use("/auth", userRouter);

app.get("/", (req, res) => {
  res.send("Server Running...");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `Server running on:
   → Local:   http://localhost:${PORT}
   → Network: http://192.168.0.35:${PORT}`,
  );
});
