import { Router } from "express";
import { login, signup } from "../controllers/auth";

const router = Router();

router.post("/login", login);

router.put("/signup", signup);

export default router;
