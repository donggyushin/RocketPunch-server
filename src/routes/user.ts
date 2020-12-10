import FetchUsers from "../controllers/users/fetchUsers";
import LoginUser from "../controllers/users/loginUser";
import NewUser from "../controllers/users/newUser";
import express from "express";
const router = express.Router();

router.get("/list", FetchUsers);

router.post("/login", LoginUser);
router.post("", NewUser);

export default router;
