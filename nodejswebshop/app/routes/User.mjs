import express from "express";
import { User } from "../db/sequelize.mjs";
import { auth } from "../auth/auth.mjs";

const userRouter = express();

userRouter.get("/", auth, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "username", "isAdmin"],
    });

    return res.json({ users });
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
});

userRouter.get("/id/:id/", auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user === null) {
      const message =
        "L'utilisateur demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
      return res.status(404).json({ message });
    }
    const message = `L'utilisateur dont l'id vaut ${user.id} a bien été récupéré.`;
    return res.json({ message, data: user });
  } catch (error) {
    const message =
      "L'utilisateur n'a pas pu être récupéré. Merci de réessayer dans quelques instants.";
    return res.status(500).json({ message, data: error });
  }
});

userRouter.get("/:username", auth, async (req, res) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ where: { username: username } });
    if (username === null) {
      const message =
        "L'utilisateur demandé n'existe pas. Merci de réessayer avec autre nom.";
      return res.status(404).json({ message });
    }
    const message = `L'utilisateur dont l'id vaut a bien été récupéré.`;
    return res.json({ message, data: user });
  } catch (error) {
    const message =
      "L'utilisateur n'a pas pu être récupéré. Merci de réessayer dans quelques instants.";
    return res.status(500).json({ message, data: error });
  }
});

export { userRouter };
