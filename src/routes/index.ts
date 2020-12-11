import chat from "./chat";
import express from "express";
import user from "./user";
const router = express.Router();

router.use("/user", user);
router.use("/chat", chat);

export default router;
