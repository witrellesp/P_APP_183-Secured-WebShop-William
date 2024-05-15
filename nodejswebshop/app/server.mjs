import express from "express";
import https from "https";
import fs from "fs";
import { initDb, sequelize } from "./db/sequelize.mjs";
import { userRouter } from "./routes/User.mjs";

const app = express();

// Configurer les options HTTPS avec les fichiers de clé et de certificat
const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};


app.get("/login", (req, res) => {
  res.status(200).send("Login Page");
});

app.get("/", (req, res) => {
  res.send("Home Page");
});

// Authentification de la base de données
sequelize.authenticate()
  .then(() => {
    console.log("La connexion à la base de données a bien été établie");
  })
  .catch((error) => {
    console.error("Impossible de se connecter à la DB", error);
  });

//Initialiser la base de données
initDb();


app.use("/users", userRouter);

// Creer et demarrer le serveur
https.createServer(options, app).listen(443, () => {
  console.log("Server running on port 443");
});
