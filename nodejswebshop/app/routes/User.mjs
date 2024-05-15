import express from "express";
import users from "../db/users-mock.mjs";

const userRouter = express();

userRouter.get("/", (req, res) => {
  res.send(users);
});

export { userRouter };
