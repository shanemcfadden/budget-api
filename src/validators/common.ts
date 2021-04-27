import { body } from "express-validator";

export const trimDescription = body("description").trim();
