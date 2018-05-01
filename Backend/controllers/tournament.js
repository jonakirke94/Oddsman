const express = require("express");
const router = express.Router();
const db = require("../db/db");
const msg = require("../db/http");
const mysql = require("mysql");
const jwtDecode = require('jwt-decode');

exports.create = (req, res, next) => {
  const start = req.body.start;
  const end = req.body.end;
  const name = req.body.name;

  //check if valid email
  req.check("name", "Email is empty").notEmpty();
  req.check("start", "Startdate is empty").notEmpty();
  req.check("end", "Enddate is empty").notEmpty();

  const errors = req.validationErrors();

  if (errors) {
    return msg.show400(req, res, errors);
  }

  //check if name is unique
  module.exports.getByName(name, function(data) {
    if (data) {
      return msg.show409(req, res, "Tournament name exists");
    }

    const startDate = new Date(start).toISOString().substring(0, 10);
    const endDate = new Date(end).toISOString().substring(0, 10);

    const sql = `INSERT INTO Tournaments (Name,Start,End)
            VALUES (${mysql.escape(name)}, ${mysql.escape(
      startDate
    )}, ${mysql.escape(endDate)})`;

    db.executeSql(sql, function(data, err) {
      if (err) {
        return msg.show500(req, res, err);
      }
      return msg.show200(req, res, "Success");
    });
  });
};

exports.getByName = (name, callback) => {
  const sql = `SELECT * FROM Tournaments WHERE Name=${mysql.escape(name)}`;
  db.executeSql(sql, function(data, err) {
    if (err) {
      callback(null, err);
    } else {
      callback(data[0]);
    }
  });
};

exports.get_all = (req, res, next) => {
  const sql = `SELECT * FROM Tournaments`;

  db.executeSql(sql, function(data, err) {
    if (err) {
      return msg.show500(req, res, err);
    }
    return msg.show200(req, res, "Success", data);
  });
};

exports.request = (req, res, next) => {
  const userId = getUserId(req);
  const tourId = req.params.tourid

  //check if user already has requested

  const sql = `INSERT INTO Requests (User_Id,Tournament_Id)
            VALUES (${mysql.escape(userId)}, ${mysql.escape(tourId)})`;

  db.executeSql(sql, function(data, err) {
    if (err) {
      console.log(err)
      return msg.show500(req, res, err);
    }
    return msg.show200(req, res, "Success");
  });
}

exports.requests_all = (req, res, next) => {
  const userId = getUserId(req);


  const sql = `SELECT *
  FROM Tournaments tour
  LEFT OUTER JOIN Requests req
  ON (tour.TournamentId = req.Tournament_Id AND req.User_Id = ${mysql.escape(userId)})
  LEFT OUTER JOIN Tournament_Users tour_user
  ON (tour.TournamentId = tour_user.Tournament_Id AND tour_user.User_Id = ${mysql.escape(userId)})
  WHERE req.Status != 'accepted' AND tour_user.Tournament_Id IS NULL`

  db.executeSql(sql, function(data, err) {
    if (err) {
      console.log(err)
      return msg.show500(req, res, err);
    }
    return msg.show200(req, res, "Success", data);
  });
}

function getUserId(req) {
  //decode the token and fetch id
  const token = req.headers.authorization.split(' ');
  var decoded = jwtDecode(token[1]);
  return decoded.userId;
}

exports.get_enrolled_tournaments = (req, res, next) => {
  //might wanna check for tournaments with userid rather than accepted requests
  const userId = getUserId(req);

  const sql = `SELECT *
  FROM Tournaments tour
  LEFT OUTER JOIN Tournament_Users req
  ON (tour.TournamentId = req.Tournament_Id AND req.User_Id = ${mysql.escape(userId)})
  WHERE tour.TournamentId = req.Tournament_Id`             

  db.executeSql(sql, function(data, err) {
    if (err) {
      return msg.show500(req, res, err);
    }
    return msg.show200(req, res, "Success", data);
  });
}


exports.get_unenrolled_tournaments = (req, res, next) => {
  //fetch unenrolled tournaments that has not yet started and where the user has no request
  const userId = getUserId(req);

  const sql = `SELECT *
  FROM Tournaments tour
  LEFT OUTER JOIN Requests req
  ON (tour.TournamentId = req.Tournament_Id AND req.User_Id = ${mysql.escape(userId)})
  LEFT OUTER JOIN Tournament_Users tour_user
  ON (tour.TournamentId = tour_user.Tournament_Id AND tour_user.User_Id = ${mysql.escape(userId)})
  WHERE req.Tournament_Id IS NULL AND tour_user.Tournament_Id IS NULL AND tour.Start > CURDATE();`
            
  db.executeSql(sql, function(data, err) {
    if (err) {
      console.log(err)
      return msg.show500(req, res, err);
    }
    return msg.show200(req, res, "Success", data);
  });
}

