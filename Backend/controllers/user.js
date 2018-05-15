const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const jwtDecode = require('jwt-decode');

const tokenController = require('../controllers/token');

const msg = require("../db/http");
const db = require('../models');
const helper = require('../controllers/helper');
const User = db.users;
const Bet = db.bets;
const sequelize = require('sequelize');
const Match = db.matches;
const Result = db.results;

exports.update = (req, res, next) => {
  const userId = helper.getUserId(req);

  if (userId === -1) {
    return msg.show500(req, res, 'Couldnt fetch userid');
  }

  const name = req.body.name;
  const email = req.body.email;
  const tag = req.body.tag;

  //array to hold fields which will be updated
  let fields = [];

  if (name) {
    fields.push('Name')
  }

  if (email) {
    req.check("email", "Email is not a valid email").isEmail();
    const errors = req.validationErrors();
    if (errors) {
      return msg.show400(req, res, errors);
    }

    fields.push("Email");
  }

  if (tag) {
    fields.push('Tag')
  }

  if (fields.length === 0) {
    return msg.show400(req, res, "No inputs provided");
  }


  User.findById(userId).then(userToUpdate => {
    userToUpdate
      .update({
        Name: name,
        Tag: tag,
        Email: email
      }, {
        fields: fields
      }) //only update fields with a value
      .then(success => {
        return msg.show200(req, res, "Success");
      })
      .catch(db.Sequelize.ValidationError, function (err) {
        return msg.show409(req, res, "Validation Error", err.errors[0].message);
      });
  });
}

exports.user_signup = (req, res, next) => {
  const name = req.body.name;
  const tag = req.body.tag;
  const email = req.body.email;
  const password = req.body.password;

  //check if valid email
  req.check("email", "Email is not a valid email").isEmail();
  req.check("password", "Password has to be 8 characters").isLength({
    min: 8
  });

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
      .catch(db.Sequelize.ValidationError, function (err) {
        return msg.show409(req, res, 'Validation Error', err.errors[0].message);
      })
  });
};

exports.user_login = (req, res, next) => {
  const email = req.body.email;

  module.exports.getByEmail(email).then(user => {
    if (!user || !req.body.password) {
      return msg.show401(req, res, next);
    }

    //check if passwords match
    bcrypt.compare(req.body.password, user.Password, (err, result) => {
      if (err) {
        return msg.show500(req, res, err);
      }
      if (result) {
        //generate tokens
        const tokens = tokenController.generateTokens(user);

        //save refreshtoken to user
        tokenController.saveRefreshToken(
          user.Id,
          tokens.refresh_token,
          function (success) {
            const client_data = {
              access_token: tokens.access_token,
              refresh_exp: tokens.refresh_exp,
              isAdmin: user.IsAdmin
            };

            return msg.show200(req, res, "Success", client_data);
          }
        );
      } else {
        //wrong password
        return msg.show401(req, res, next);
      }
    });
  });
};

exports.user_all = (req, res, next) => {

  const attributes = ['id', 'name', 'tag', 'email']

  User.findAll({
    attributes: attributes,
    raw: true,
    where: {
      IsAdmin: false
    }
  }).then(users => {
    return msg.show200(req, res, "Fetched Users", users);
  }).catch(function (err) {
    return msg.show500(req, res, err);
  });
}

exports.getById = (id) => {
  return User.findById(id).then(user => {
    if (user == null) {
      return null;
    } else {
      return user.dataValues;
    }
  })
}

exports.getByEmail = (email) => {
  return User.findOne({
    where: {
      'Email': email
    }
  }).then(user => {
    if (user === null) {
      return null;
    } else {
      return user.dataValues;
    }
  })
}


exports.bets = (req, res, next) => {
  const userId = helper.getUserId(req);
  const tourId = req.params.tourid;
  Bet.findAll({
      attributes: ['id', 'option', 'optionNo', 'week'],
      where: {
        userId: userId,
        tournamentId: tourId
      },
      order: [
        ["Week", "DESC"]
      ],
      include: {
        model: Match,
        attributes: ['matchId', 'matchDate', 'matchName', 'Option1Odds', 'Option2Odds', 'Option3Odds'],
        include: {
          model: Result,
          attributes: ['endResult', 'correctBet']
        }
      }
    })
    .then((bets) => {
      if (bets.length === 0) {
        return msg.show200(req, res, "No bets found", []);
      }

      let results = [];
      for (let i = 0; i < bets.length; i++) {
        let b = JSON.parse(JSON.stringify(bets[i]));
        switch (b.optionNo) {
          case "1":
            b.odds = b.match.Option1Odds;
            break;
          case "X":
            b.odds = b.match.Option2Odds;
            break;
          case "2":
            b.odds = b.match.Option3Odds;
            break;
          default:
            b.odds = null;
            break;
        }
        results.push(b);
        if (i === bets.length - 1) {
          return msg.show200(req, res, "Success", results);
        }
      }
    })
    .catch(db.Sequelize.ValidationError, function (err) {
      return msg.show409(req, res, 'Validation Error', err.errors[0].message);
    });
}