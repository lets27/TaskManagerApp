import { Router } from "express";
import { login, signup, upload } from "../controllers/authControllers.js";

const authRouter = Router();

authRouter.post("/signup", upload.single("file"), signup);
authRouter.post("/login", login);

export default authRouter;
