const express = require("express");
const router = express.Router();
 const db = require("../db/db"); 
const msg = require("../db/http");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const tokenController = require('../controllers/token');
const jwtDecode = require('jwt-decode');

const seq = require('../models');
const User = seq.users;



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

exports.update = (req, res, next) => {
  const userid = getUserId(req);

  if(userid === -1) {
    return msg.show500(req, res, 'Couldnt fetch userid');
  }

  const name = req.body.name;
  const email = req.body.email;
  const tag = req.body.tag;

  if(!name && !email && !tag) {
    return msg.show400(req, res, "No inputs provided");
  }

   //check if valid email
   if(email) {
    req.check("email", "Email is not a valid email").isEmail(); 
    const errors = req.validationErrors();
    if (errors) {
      return msg.show400(req, res, errors);
    }
   }

  let buildSql = "UPDATE Users SET ";

    //add if new email isn't empty
    if (email) {
      buildSql += `Email=${mysql.escape(email)},`
    }

    if(name) {
      buildSql += `Name=${mysql.escape(name)},`
    }

    if(tag) {
      buildSql += `Tag=${mysql.escape(tag)},`
    }

      //remove trailing comma
      buildSql = buildSql.slice(0, -1);
      buildSql += ` WHERE UserId = ${mysql.escape(userid)}`;
    
    db.executeSql(buildSql, function(data, err) {
      if(err) {
        if(err.sqlMessage.includes('email_unique') || err.sqlMessage.includes('tag_unique')) {
          let errors = 'Error';
          if(err.sqlMessage.includes('email_unique')) errors ='Email is already taken';
          if(err.sqlMessage.includes('tag_unique')) errors ='Tag is already taken';
          return msg.show409(req, res, "Duplicate entries", errors);
        }

        return msg.show500(req, res, err);
      }

        return msg.show200(req, res, "Success");
    })
} 

exports.get_by_id = (id) => {
  return User.findById(id).then(user => {
    if(user == null) {
      return null;
    } else {
     return user.dataValues;
    }
  })
}

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

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      return msg.show500(req, res, err);
    } 

    const newUser = {
      Name: name,
      Tag: tag,
      Email: email,
      Password: hash,
      IsAdmin: false
    }

    User
      .create(newUser).then(user => {
        return msg.show200(req, res, "Success", user.dataValues);
      })
      .catch(seq.Sequelize.ValidationError, function (err) {
        //console.log( err.errors[0].message)
        return msg.show400(req, res, err.errors[0].message);
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

 
/* HELPER */
 function getUserId(req) {
  //decode the token and fetch id
  const token = req.headers.authorization.split(' ');

  try {
    var decoded = jwtDecode(token[1])
    return decoded.userId;
  } catch (err) {
    return -1;
  }
} 