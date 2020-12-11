import FetchMe from "../controllers/users/fetchMe";
import FetchUsers from "../controllers/users/fetchUsers";
import LoginUser from "../controllers/users/loginUser";
import NewUser from "../controllers/users/newUser";
import express from "express";
const router = express.Router();

router.get("/list", FetchUsers);
router.get("/me", FetchMe);

router.post("/login", LoginUser);
router.post("", NewUser);

export default router;
