import dotenv from "dotenv/config";
import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(helmet());
app.use(
  express.urlencoded({
    extended: true,
  }),
);
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
