import dotenv from "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import authRouter from "./src/modules/auth/router.js";
import userRouter from "./src/modules/user/router.js";
import cookieParser from "cookie-parser";
import authMiddleware from "./src/middlewares/auth.middleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploads = path.join(__dirname, "uploads");

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
app.use(express.static(uploads));
app.use(cors());
app.use(helmet());
app.use(cookieParser());
app.use(morgan("dev"));

// ` =========================
// ? Middlewares
// ` =========================

app.use("/auth", authRouter);

app.use(authMiddleware);

app.use("/user", userRouter);

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
