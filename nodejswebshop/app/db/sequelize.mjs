import { DataTypes, Sequelize } from "sequelize";
import { UserModel } from "../models/user.mjs";
import users from "./users-mock.mjs";
import bcrypt from "bcrypt";

const sequelize = new Sequelize(
  "db_web", // Nom de la DB qui doit exister
  "root", // Nom de l'utilisateur
  "root", // Mot de passe de l'utilisateur
  {
    host: "localhost",
    port: "6033",
    dialect: "mysql",
    logging: false,
  }
);

const User = UserModel(sequelize, DataTypes);

let initDb = async () => {
  try {
    await sequelize.sync({ force: true });
    await importUsers();
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

const importUsers = async () => {
  for (const user of users) {
    const hash = await bcrypt.hash(user.password, 10); // temps pour hasher = du sel
    const createdUser = await User.create({
      username: user.username,
      password: hash,
      isAdmin: user.isAdmin,
    });
    console.log(createdUser.toJSON()); // -> inspecter les données importés
  }
};

export { sequelize, initDb, User };
