const db = require("../db/db");
const config = require("config");
const userController = require('../controllers/user');
const bcrypt = require('bcrypt');
const mysql= require('mysql');
const msg = require('../db/http');


exports.seedAdmin = (user, req, res) => {
    userController.getUserByProperty('Email', user.Email, function(data) {
        if(!data) {
            //seed if the admin has not already been added
         
            bcrypt.hash(user.Password, 10, (err, hash) => {
                if (err) {
                    console.log('Error when hashing password')
                } 
      
                  const sql = `INSERT INTO Users (Name,Tag,Email,Password, IsAdmin)
                  VALUES (${mysql.escape(user.Name)}, ${mysql.escape(user.Tag)}, ${mysql.escape(
                    user.Email
                  )}, ${mysql.escape(hash)}, ${mysql.escape(user.IsAdmin)})`;
          
                  db.executeSql(sql, function(data, err) {
                    if (err) {
                       console.log('Error seeding admin..')
                    }
                    
                    console.log('Seeded admin successfully')
                  });               
              });
        }      
      })

}