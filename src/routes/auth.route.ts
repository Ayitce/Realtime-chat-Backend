//Import module
import express from "express"
import { register, getUserByUsername, login, } from "../controllers/auth.controller";
import { getUser } from '../middlewares/auth.middleware';

//Declare route
const router = express.Router();

//Define route
router.post("/register", register);
router.post("/login", login)
router.get("/user",getUser, getUserByUsername)
export default router;
