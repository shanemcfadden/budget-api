import { Router } from "express";

const router = Router();

router.post("/login", (req, res, next) => {
  res.send("POST /auth/login");
});

router.put("/signup", (req, res, next) => {
  res.send("PUT /auth/signup");
});

export default router;
