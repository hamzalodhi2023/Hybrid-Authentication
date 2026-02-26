import express from "express";
import updateProfile from "./controllers/update.controller.js";

const router = express.Router();

router.patch("/", updateProfile);

export default router;
