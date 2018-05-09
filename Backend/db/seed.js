
const config = require("config");
const userController = require('../controllers/user');
const bcrypt = require('bcrypt');
const mysql= require('mysql');
const db = require('../models')
const User = db.users;


exports.seedAdmin = (user, req, res) => {
  bcrypt.hash(config.ADMIN_PASSWORD, 10, (err, hash) => {
    User.findOrCreate({
      where: { email: user.Email },
      defaults: {
        Email: user.Email,
        Name: user.Name,
        Tag: user.Tag,
        IsAdmin: true,
        Password: hash
      }
    }).spread((user, created) => {
      if (user) {
        console.log("Admin already seeded");
      }
      if (created) {
        console.log("Seeded admin successfully");
      }
    });
  });
};


