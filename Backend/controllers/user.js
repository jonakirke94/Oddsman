const express = require("express");
const router = express.Router();
const db = require("../db/db");
const msg = require("../db/http");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const tokenController = require('../controllers/token');


exports.getUserByProperty = (column, value, callback) => {
  const sql = `SELECT * FROM Users WHERE ${column}=${mysql.escape(value)}`;
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

  //check if email is unique
  module.exports.getUserByProperty('Email', email, function(emailuser) {
    if (emailuser) {
      return msg.show409(req, res, "Email exists");
    } 
      //check if tag is unique
      module.exports.getUserByProperty('Tag', tag, function(taguser) {
        if(taguser) {
          return msg.show409(req, res, "Tag exists");    
        }

        bcrypt.hash(password, 10, (err, hash) => {
          if (err) {
            msg.show500(req, res, err);
          } 

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
          
        });
      })
  });
};

exports.user_login = (req, res, next) => {
  const email = req.body.email;

  module.exports.getUserByProperty('Email', email, function(data, err) {

    //check if the user exists
    if (typeof data == 'undefined' || !req.body.password) {
      return msg.show401(req, res, next);
    }

    //check if passwords match
    bcrypt.compare(req.body.password, data.Password, (err, result) => {
      if (err) {
        return msg.show500(req, res, err);
      }
      if (result) {

        //generate tokens
        const tokens = tokenController.generateTokens(data);

        tokenController.saveRefreshToken(data.UserId, tokens.refresh_token, function(success) {
          const client_data = {
            access_token: tokens.access_token,
            refresh_exp: tokens.refresh_exp,
            isAdmin: data.IsAdmin
          }
  
          return msg.show200(req, res, "Success", client_data)
        });

      }  else {
        return msg.show401(req, res, next);
      }
    })
  })
}

exports.user_all = (req, res, next) => {

  const sql = `SELECT * FROM Users WHERE NOT IsAdmin=True`;

  db.executeSql(sql, function(data, err) {
    if (err) {
      return msg.show500(req, res, err);
    }

    const users = data.map(x => { 
      return { 
        id: x.UserId, 
        name: x.Name,
        email: x.Email,
        tag: x.Tag       
      }
    })
      
    return msg.show200(req, res, "Success", users);
  });
}