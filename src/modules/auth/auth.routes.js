import { Router } from "express";
import { validate } from "../../utils/validate.js";
import { registerDto, loginDto } from "./auth.dto.js";
import { register, login } from "./auth.controller.js";

const r = Router();

r.post("/register", validate(registerDto), register);
r.post("/login", validate(loginDto), login);

export default r;
