import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../db/sequelize.mjs";
import { privateKey } from "../auth/private_key.mjs";

// Création du routeur
const loginRouter = express();

// Traiter les requêtes au format JSON
loginRouter.use(express.json());

// Définition de la route POST pour la connexion
loginRouter.post("/", (req, res) => {
  // Recherche de l'utilisateur dans la base de données en fonction du nom d'utilisateur
  User.findOne({ where: { username: req.body.username } })
    .then((user) => {
      if (!user) {
        // Si l'utilisateur n'est pas trouvé, renvoyer un message d'erreur 404
        const message = `L'utilisateur demandé n'existe pas`;
        return res.status(404).json({ message });
      }
      // Comparaison du mot de passe fourni avec le mot de passe haché stocké dans la base de données
      bcrypt
        .compare(req.body.password, user.password)
        .then((isPasswordValid) => {
          if (!isPasswordValid) {
            // Si le mot de passe est incorrect, renvoyer un message d'erreur 401
            const message = `Le mot de passe est incorrect.`;
            return res.status(401).json({ message });
          } else {
            // Si le mot de passe est valide, générer un jeton JWT pour l'authentification
            const token = jwt.sign({ userId: user.id }, privateKey, {
              expiresIn: "1y",
            });
            // Renvoyer un message de succès avec les données utilisateur et le jeton JWT
            const message = `L'utilisateur a été connecté avec succès`;
            return res.json({ message, data: user, token });
          }
        });
    })
    .catch((error) => {
      // En cas d'erreur lors de la connexion de l'utilisateur, renvoyer un message d'erreur avec les détails de l'erreur
      const message = `L'utilisateur n'a pas pu être connecté. Réessayez dans quelques instants`;
      return res.json({ message, data: error });
    });
});

// Exportation du routeur de connexion
export { loginRouter };
