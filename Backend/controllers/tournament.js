const express = require("express");
const router = express.Router();
const db = require("../db/db");
const msg = require("../db/http");
const mysql = require("mysql");

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

exports.invite = (req, res, next) => {
  const userId = req.params.userid
  const tourId = req.params.tourid

  console.log('uId ' + userId + 'tId ' + tourId)

}

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
  const userId = req.params.userid
  const tourId = req.params.tourid

  const sql = `INSERT INTO Requests (UserId,TournamentId)
            VALUES (${mysql.escape(userId)}, ${mysql.escape(tourId)})`;

  db.executeSql(sql, function(data, err) {
    if (err) {
      return msg.show500(req, res, err);
    }
    return msg.show200(req, res, "Success");
  });
}

exports.requests_all = (req, res, next) => {
  const userId = req.params.userid

  const sql = `SELECT Tournaments.*, Requests.Status
              FROM Tournaments
              INNER JOIN Requests
              ON Tournaments.TournamentId = Requests.TournamentId
              WHERE Requests.UserId = ${mysql.escape(userId)}`

  db.executeSql(sql, function(data, err) {
    if (err) {
      return msg.show500(req, res, err);
    }
    return msg.show200(req, res, "Success", data);
  });
}

