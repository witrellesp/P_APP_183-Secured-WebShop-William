const { Sequelize } = "sequelize";

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
module.exports = { sequelize };
