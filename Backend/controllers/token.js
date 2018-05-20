const express = require("express");
const router = express.Router();
const msg = require("../db/http");
const mysql = require('mysql');

var path = require('path');
var env = process.env.NODE_ENV || 'test';
var config  = require(path.join(__dirname, '..', 'config', 'config.json'))[env];

const jwt = require("jsonwebtoken");
const userController = require('./user');

const seq = require('../models');
const UserTabel = seq.users;


exports.refresh_token = (req, res, next) => {
  const token = req.body.accesstoken;

  //get userid from JWT payload
  const decoded = jwt.verify(token, config.JWT_ACCESS_SECRET, {
    ignoreExpiration: true
  });

 const email = decoded.email;

 userController.getByEmail(email).then(user => {
   if(!user) {
    return msg.show400(req, res, err);
   }

   const tokens = module.exports.generateTokens(user);

   module.exports.saveRefreshToken(user.Id, tokens.refresh_token, function(data) {
    const newTokens = {
      access_token: tokens.access_token,
      refresh_exp: tokens.refresh_exp
    };

    return msg.show200(req, res, "Refreshed Succesfully", newTokens);
  });

 })
}

exports.saveRefreshToken = (id, refreshtoken, callback) => {

    UserTabel.update({ RefreshToken: refreshtoken }, { where: { Id: id } })
      .then(success => {
        return callback(success);
      })
      .catch(function(err) {
        return msg.show500(req, res, err);
      });
};

exports.generateTokens = user => {
    const REFRESH_EXP = 691200; // 691200s = 8d
    const ACCESS_EXP = 300; // 300s = 5m
 
    const ACCESS_TOKEN = jwt.sign({
        email: user.Email,
        userId: user.Id,
        isAdmin: user.IsAdmin
      },
      config.JWT_ACCESS_SECRET,
      {
        //options
        expiresIn: ACCESS_EXP
      }
    );
  
    const REFRESH_TOKEN = jwt.sign({
        email: user.Email,
        userId: user.Id
      },
      config.JWT_REFRESH_SECRET,
      {
        expiresIn: REFRESH_EXP
      }
    );
  
    return tokens = {
      access_token: ACCESS_TOKEN,
      access_exp: ACCESS_EXP,
      refresh_token: REFRESH_TOKEN,
      refresh_exp: REFRESH_EXP
    };
};

