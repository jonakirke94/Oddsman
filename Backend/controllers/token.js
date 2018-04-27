const express = require("express");
const router = express.Router();
const db = require('../db/db');
const msg = require("../db/http");
const mysql = require('mysql');
const config = require('config');
const jwt = require("jsonwebtoken");



exports.refreshToken = (req, res, next) => {


}

exports.saveRefreshToken = (id, refreshtoken, callback) => { 
    db.executeSql(
      `UPDATE Users SET Refreshtoken=${mysql.escape(refreshtoken)} WHERE UserId=${mysql.escape(id)}`,
      function(data, err) {
        if (err) {
          msg.show500(req, res, err);
        }

        return callback(data);

      }
    );
  };

exports.generateTokens = user => {
    const REFRESH_EXP = 600; // 691200s = 8d
    const ACCESS_EXP = 10; // 300s = 5m
 
    const ACCESS_TOKEN = jwt.sign({
        email: user.Email,
        userId: user.UserId
      },
      config.JWT_ACCESS_SECRET,
      {
        //options
        expiresIn: ACCESS_EXP
      }
    );
  
    const REFRESH_TOKEN = jwt.sign({
        email: user.Email,
        userId: user.UserId
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

