//Import module
import express from "express"
import { addUser, login, } from "../controllers/auth.controller";

//Declare route
const router = express.Router();

//Define route
router.post("/", addUser);
router.post("/login", login)
export default router;
