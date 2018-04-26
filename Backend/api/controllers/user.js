const express = require("express");
const router = express.Router();
const db = require("../../db/db");
const msg = require("../../db/http");
const mysql = require('mysql');

exports.user_signup = (req, res, next) => {
    const sql = "SELECT * FROM Persons";

    db.executeSql(sql, function(data, err) {
        if (err) {
          return msg.show500(req, res, err);
        } 
         
          msg.show200(req, res, next, data);            
      }
    );
}

exports.get_all = (req, res, next) => {
  const sql = "SELECT * FROM Persons";

  db.executeSql(sql, function(data, err) {
      if (err) {
        return msg.show500(req, res, err);
      } 
       
        msg.show200(req, res, 'Success', data);            
    }
  );
}

exports.create = (req, res, next) => {
  const name = req.body.name;
  const lastname = req.body.lastname;

  const sql = `INSERT INTO Persons (FirstName,LastName)
  VALUES (${mysql.escape(name)}, ${mysql.escape(lastname)})`;

  db.executeSql(sql, function(data, err) {
      if (err) {
        return msg.show500(req, res, err);
      } 
       
        msg.show200(req, res, 'Success');            
    }
  );
}