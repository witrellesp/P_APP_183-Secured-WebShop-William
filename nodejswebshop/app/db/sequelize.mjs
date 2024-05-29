import { DataTypes, Sequelize } from "sequelize";
import { UserModel } from "../models/user.mjs"; // Import du modèle de l'utilisateur
import users from "./users-mock.mjs"; // Import des données utilisateur fictives
import bcrypt from "bcrypt"; // Import du module bcrypt pour le hashage des mots de passe

// Création d'une instance Sequelize pour se connecter à la base de données
const sequelize = new Sequelize(
  "db_web", // Nom de la DB qui doit exister
  "root", // Nom de l'utilisateur
  "root", // Mot de passe de l'utilisateur
  {
    host: "localhost",
    port: "6033",
    dialect: "mysql", // Type de la base de données
    logging: false, // Désactivation des logs SQL
  }
);

// Création du modèle d'utilisateur en utilisant le modèle importé et les types de données Sequelize
const User = UserModel(sequelize, DataTypes);

// Fonction pour initialiser la base de données
let initDb = async () => {
  try {
    await sequelize.sync({ force: true }); // Synchronisation avec la base de données, force:true supprime et recrée toutes les tables
    await importUsers(); // Import des utilisateurs
    console.log(
      "La base de données db_passion_lecture a bien été synchronisée"
    );
  } catch (error) {
    console.error(
      "Erreur lors de l'initialisation de la base de données :",
      error
    );
  }
};

// Fonction pour importer les utilisateurs fictifs dans la base de données
const importUsers = async () => {
  for (const user of users) {
    const hash = await bcrypt.hash(user.password, 10); // Hashage du mot de passe avec un sel
    const createdUser = await User.create({
      username: user.username,
      password: hash,
      isAdmin: user.isAdmin,
    });
    console.log(createdUser.toJSON()); // Affichage des données de l'utilisateur importé
  }
};

// Export des éléments nécessaires
export { sequelize, initDb, User };
