const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("site e-commerce ");
});

app.get("/", (req, res) => {
  res.redirect(`http://localhost:8080/`);
});

//monter la route userRoute
const userRoute = require("./routes/User");
app.use("/users", userRoute);

// Démarrage du serveur
app.listen(8080, () => {
  console.log("Server running on port 8080");
});
