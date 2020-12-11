import GetRoomId from "../controllers/chats/getRoomId";
import express from "express";
const router = express.Router();

router.get("/id", GetRoomId);

export default router;
