import LoginUser from "../controllers/users/loginUser";
import NewUser from "../controllers/users/newUser";
import express from "express";
const router = express.Router();

router.post("/login", LoginUser);
router.post("", NewUser);

export default router;
