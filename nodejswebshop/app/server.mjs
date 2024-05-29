import express from "express";
import https from "https";
import fs from "fs";
import { initDb, sequelize } from "./db/sequelize.mjs";

// Création de l'application Express
const app = express();

// Configuration des options HTTPS avec les fichiers de clé et de certificat
const options = {
  key: fs.readFileSync("key.pem"),
  cert: fs.readFileSync("cert.pem"),
};

// Définition d'une route pour la page d'accueil
app.get("/", (req, res) => {
  res.send("Home Page");
});

// Authentification de la base de données
sequelize
  .authenticate()
  .then(() => {
    console.log("La connexion à la base de données a bien été établie");
  })
  .catch((error) => {
    console.error("Impossible de se connecter à la DB", error);
  });

// Initialisation db
initDb();

// Importation et utilisation des routes des utilisateurs
import { userRouter } from "./routes/User.mjs";
app.use("/users", userRouter);

// Importation et utilisation de la route de connexion
import { loginRouter } from "./routes/login.mjs";
app.use("/login", loginRouter);

// Gestion des erreurs 404
app.use(({ res }) => {
  const message =
    "Impossible de trouver la ressource demandée ! Vous pouvez essayer une autre URL.";
  res.status(404).json(message);
});

// Création et démarrage du serveur HTTPS
https.createServer(options, app).listen(443, () => {
  console.log("Server running on port 443");
});
