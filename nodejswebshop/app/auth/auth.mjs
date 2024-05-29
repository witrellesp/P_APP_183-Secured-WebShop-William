import jwt from "jsonwebtoken";
import { privateKey } from "./private_key.mjs";
import { User } from "../db/sequelize.mjs"; // Importa el modelo de usuario desde tu archivo sequelize

const auth = async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    const message = `Vous n'avez pas fourni de jeton d'authentification. Ajoutez-en un dans l'en-tête de la requête.`;
    return res.status(401).json({ message });
  } else {
    const token = authorizationHeader.split(" ")[1];
    try {
      const decodedToken = jwt.verify(token, privateKey);
      req.userId = decodedToken.userId;

      const user = await User.findByPk(req.userId);
      if (!user || !user.isAdmin) {
        const message = `L'utilisateur n'est pas autorisé à accéder à cette ressource.`;
        return res.status(401).json({ message });
      }

      next();
    } catch (error) {
      const message = `L'utilisateur n'est pas autorisé à accéder à cette ressource.`;
      return res.status(401).json({ message, data: error });
    }
  }
};

export { auth };
