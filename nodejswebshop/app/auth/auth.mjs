import jwt from "jsonwebtoken"; // Import du module jsonwebtoken pour la gestion des JWT
import { privateKey } from "./private_key.mjs"; // Import de la clé privée pour la vérification du JWT
import { User } from "../db/sequelize.mjs"; // Import du modèle utilisateur depuis le fichier sequelize

const auth = async (req, res, next) => {
  // Vérification de la présence du jeton d'authentification dans l'en-tête de la requête
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    const message = `Vous n'avez pas fourni de jeton d'authentification. Ajoutez-en un dans l'en-tête de la requête.`;
    return res.status(401).json({ message }); // Retourne une erreur 401 si aucun jeton n'est fourni
  } else {
    // Extraction du jeton du header
    const token = authorizationHeader.split(" ")[1];
    try {
      // Vérification du jeton
      const decodedToken = jwt.verify(token, privateKey);
      req.userId = decodedToken.userId; // Stocke l'ID de l'utilisateur dans la requête

      // Vérification du rôle administrateur
      const user = await User.findByPk(req.userId);
      if (!user || !user.isAdmin) {
        const message = `L'utilisateur n'est pas autorisé à accéder à cette ressource.`;
        return res.status(401).json({ message }); // Retourne une erreur 401 si l'utilisateur n'est pas autorisé
      }

      next();
    } catch (error) {
      const message = `L'utilisateur n'est pas autorisé à accéder à cette ressource.`;
      return res.status(401).json({ message, data: error });
    }
  }
};

export { auth };
