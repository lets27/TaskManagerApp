import { Router } from "express";
import {
  deleteAll,
  deleteCompleted,
  deleteTask,
  editTask,
  getTasks,
  getUser,
  makeTask,
  markComplete,
  updateUser,
  upload,
} from "../controllers/userControllers.js";
import { verifyToken } from "../util.js";

const userRouter = Router();
userRouter.use(verifyToken);
userRouter.get("/user", getUser);
userRouter.post("/task", makeTask);
userRouter.get("/tasks", getTasks);
userRouter.delete("/task/:taskId", deleteTask);
userRouter.delete("/user/tasks/completed", deleteCompleted);
userRouter.delete("/user/tasks/all", deleteAll);
userRouter.patch("/user/task/:taskId", markComplete); //added markcomplete route
userRouter.patch("/task/:taskId", editTask);
userRouter.patch("/user", upload.single("profilePicture"), updateUser);

export default userRouter;
