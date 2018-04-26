const express = require("express");
const router = express.Router();
const db = require("../db/db");
const msg = require("../db/http");
const mysql = require("mysql");

exports.userById = (id, callback) => {
  const sql = `SELECT * FROM Users WHERE UserId=${mysql.escape(id)}`;
  db.executeSql(sql, function(data, err) {
    if (err) {
      callback(null, err);
    } else {
      callback(data[0]);
    }
  });
};

exports.userByEmail = (email, callback) => {
  const sql = `SELECT * FROM Users WHERE Email=${mysql.escape(email)}`;
  db.executeSql(sql, function(data, err) {
    if (err) {
      callback(null, err);
    } else {
      callback(data[0]);
    }
  });
};

exports.user_signup = (req, res, next) => {
  const name = req.body.name;
  const tag = req.body.tag;
  const email = req.body.email;
  const password = req.body.password;

  //check if valid email
  req.check("email", "Email is not a valid email").isEmail();
  req.check("password", "Password has to be 8 characters").isLength({ min: 8 });

  const errors = req.validationErrors();

  if (errors) {
    return msg.show400(req, res, errors);
  }

  //check if unique
  module.exports.userByEmail(email, function(data) {
    if (data) {
      return msg.show409(req, res, "Email exists");
    }

    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        msg.show500(req, res, err);
      } else {
        const sql = `INSERT INTO Users (Name,Tag,Email,Password)
        VALUES (${mysql.escape(name)}, ${mysql.escape(tag)}, ${mysql.escape(
          email
        )}, ${mysql.escape(hash)})`;

        db.executeSql(sql, function(data, err) {
          if (err) {
            return msg.show500(req, res, err);
          }
          return msg.show200(req, res, "Success");
        });
      }
    });
  });
};

