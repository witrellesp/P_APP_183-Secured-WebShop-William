import express from "express";
import https from "https";
import fs from "fs";
import { initDb, sequelize } from "./db/sequelize.mjs";

const app = express();

// Configurer les options HTTPS avec les fichiers de clé et de certificat
const options = {
  key: fs.readFileSync("key.pem"),
  cert: fs.readFileSync("cert.pem"),
};

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

//Initialiser la base de données
initDb();

import { userRouter } from "./routes/User.mjs";
app.use("/users", userRouter);

import { loginRouter } from "./routes/login.mjs";
app.use("/login", loginRouter);

app.use(({ res }) => {
  const message =
    "Impossible de trouver la ressource demandée ! Vous pouvez essayer une autre URL.";
  res.status(404).json(message);
});

// Creer et demarrer le serveur
https.createServer(options, app).listen(443, () => {
  console.log("Server running on port 443");
});
