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
app.use(helmet());
app.use(morgan("dev"));
// ` =========================
// ? Middlewares
// ` =========================

app.use("/auth", userRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
