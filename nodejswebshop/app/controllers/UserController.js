const { users } = require("../db/users-mock.js");

module.exports = {
  get: (req, res) => {
    res.send(users);
  },
};


