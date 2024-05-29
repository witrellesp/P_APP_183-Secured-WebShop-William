import express from "express";
import { User } from "../db/sequelize.mjs";
import { auth } from "../auth/auth.mjs";

const userRouter = express();

// Récupérer tous les utilisateurs
userRouter.get("/", auth, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "username", "isAdmin"],
    });
    return res.json({ users });
  } catch (error) {
    return res.status(500).json(error);
  }
});

// Récupérer un utilisateur par son ID
userRouter.get("/id/:id/", auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({ message: "L'utilisateur demandé n'existe pas." });
    }
    return res.json({
      message: `L'utilisateur dont l'id vaut ${user.id} a bien été récupéré.`,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "L'utilisateur n'a pas pu être récupéré.",
      data: error,
    });
  }
});

// Récupérer un utilisateur par son nom d'utilisateur
userRouter.get("/:username", auth, async (req, res) => {
  try {
    const user = await User.findOne({
      where: { username: req.params.username },
    });
    if (!user) {
      return res
        .status(404)
        .json({ message: "L'utilisateur demandé n'existe pas." });
    }
    return res.json({
      message: `L'utilisateur dont le nom d'utilisateur est ${user.username} a bien été récupéré.`,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "L'utilisateur n'a pas pu être récupéré.",
      data: error,
    });
  }
});

export { userRouter };
