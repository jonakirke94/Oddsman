const express = require("express");
const router = express.Router();
const db = require("../../db/db");
const msg = require("../../db/http");

const baseUrl = 'http://localhost:4200/';


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