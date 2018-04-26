const express = require("express");
const router = express.Router();
const db = require("../../db/db");
const msg = require("../../db/http");


exports.user_signup = (req, res, next) => {
    const sql = "SELECT * FROM Users";

    db.executeSql(sql, function(data, err) {
        if (err) {
          return msg.show500(req, res, err);
        } 
         
          msg.show200(req, res, next, data);            
      }
    );
}

exports.get_all = (req, res, next) => {
  const sql = "SELECT * FROM Users";

  db.executeSql(sql, function(data, err) {
      if (err) {
        return msg.show500(req, res, err);
      } 
       
        msg.show200(req, res, next, data);            
    }
  );
}