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

  const startDate = new Date(start).toISOString().substring(0, 10);
  const endDate = new Date(end).toISOString().substring(0, 10);

  //check if valid email
  req.check("name", "Email is empty").notEmpty();
  req.check("start", "Startdate is empty").notEmpty();
  req.check("end", "Enddate is empty").notEmpty();
  req.check("start", "Startdate is empty").isAfter(new Date().toDateString());
  req.check("end", "Startdate is empty").isAfter(startDate);

  const errors = req.validationErrors();

  if (errors) {
    return msg.show400(req, res, errors);
  }

  //check if name is unique
  module.exports.getByName(name, function(data) {
    if (data) {
      return msg.show409(req, res, "Tournament name exists");
    }



    const sql = `INSERT INTO Tournaments (Name,Start,End)
            VALUES (${mysql.escape(name)}, ${mysql.escape(
      startDate
    )}, ${mysql.escape(endDate)})`;

    db.executeSql(sql, function(data, err) {
      if (err) {
        console.log(err)
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

  has_requested(userId, tourId, function(result, duplicate, error){
    if (error) {
      return msg.show500(req, res, err);
    }

    if(duplicate) {
      return msg.show409(req, res, 'User already has a request');
    }
 
      is_enrolled(userId, tourId, function(result, duplicate, error){
        if(error) {
          return msg.show500(req, res, err);
        }
    
        if(duplicate) {
          return msg.show409(req, res, 'User is already enrolled');
        }

          is_tournament_started(tourId, function(started, error){
            if(error) {
              return msg.show500(req, res, err);
            }

            if(typeof started === 'undefined') {
              return msg.show409(req, res, 'Tournament already started or doesnt exist');
            }


            //if no request was found insert 
            const sql = `INSERT INTO Requests (User_Id,Tournament_Id)
            VALUES (${mysql.escape(userId)}, ${mysql.escape(tourId)})`;

            db.executeSql(sql, function(data, err) {
              if (err) {
                return msg.show500(req, res, err);
              }
              return msg.show200(req, res, "Success");
            }); //end insert request

          }) //end is_tournament_started

      }) //end is_enrolled

   })  //end has_requested
}

exports.get_tournament_requests= (req, res, next) => {
  const tourId = req.params.tourid;

  const sql = `SELECT tour.Name as tourName, tour.TournamentId as tourId, tour.Start as start, req.Status as status, users.Email as userEmail, users.Name as userName, users.Tag as userTag, users.UserId as userId
  FROM Tournaments tour
  LEFT OUTER JOIN Requests req
  ON (tour.TournamentId = req.Tournament_Id AND tour.TournamentId = ${mysql.escape(tourId)})
  LEFT OUTER JOIN Users users
  ON (req.User_Id = users.UserId AND tour.TournamentId = ${mysql.escape(tourId)})
  WHERE req.Status = 'pending'`

  db.executeSql(sql, function(data, err) {
    if (err) {
      return msg.show500(req, res, err);
    }
    return msg.show200(req, res, "Success", data);
  });
}

exports.get_users_requests = (req, res, next) => {
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
      return msg.show500(req, res, err);
    }
    return msg.show200(req, res, "Success", data);
  });
}

exports.handle_request = (req, res, next) => {
    const status = req.body.status;

    if(status === 'accepted') {
      return accept_request(req, res, next);
    } else {
      return decline_request(req, res, next);
    } 

}

function decline_request(req, res, next) {
  const tourId = req.params.tourid;
  const userId = req.params.userid;

  const sql_req = `UPDATE Requests SET Status='declined' WHERE User_Id=${mysql.escape(
    userId
  )} AND Tournament_Id=${mysql.escape(tourId)}`;
  db.executeSql(sql_req, function(data, err) {
    if (err) {
      return msg.show500(req, res, err);
    }
    return msg.show200(req, res, "Success");
  })
}

function accept_request(req, res, next) {
  const tourId = req.params.tourid;
  const userId = req.params.userid;

  is_enrolled(userId, tourId, function(result, duplicate, err) {
    if (err) {
      return msg.show500(req, res, err);
    }

    if (duplicate) {
      return msg.show409(req, res, "User is already enrolled");
    }

    is_tournament_started(tourId, function(started, error) {
      if (error) {
        return msg.show500(req, res, err);
      }

      if (typeof started === "undefined") {
        return msg.show409(
          req,
          res,
          "Tournament already started or doesnt exist"
        );
      }

      //accept request and add user to tournament
      const sql_req = `UPDATE Requests SET Status='accepted' WHERE User_Id=${mysql.escape(
        userId
      )} AND Tournament_Id=${mysql.escape(tourId)}`;
      db.executeSql(sql_req, function(data, err) {
        if (err) {
          return msg.show500(req, res, err);
        }

        //add the user
        const sql_tour = `INSERT INTO Tournament_Users (User_Id,Tournament_Id)
        VALUES (${mysql.escape(userId)}, ${mysql.escape(tourId)})`;
        db.executeSql(sql_tour, function(data, err) {
          if (err) {
            return msg.show500(req, res, err);
          }

          return msg.show200(req, res, "Success");
        }); //insert into tournament ends
      }); //update request ends
    }); //is_tournament_started ends
  }); //is_enrolled ends
};

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
      return msg.show500(req, res, err);
    }
    return msg.show200(req, res, "Success", data);
  });
}

/* HELPERS */

function getUserId(req) {
  //decode the token and fetch id
  const token = req.headers.authorization.split(' ');

  try {
    var decoded = jwtDecode(token[1])
    return decoded.userId;
  } catch (err) {
    return msg.show500(req, res, err);
  }
}

function is_enrolled(userId, tourId, callback) {
  const sql = `SELECT * FROM Tournament_Users WHERE User_Id=${mysql.escape(userId)} AND Tournament_ID=${mysql.escape(tourId)}`;
  db.executeSql(sql, function(result, err) {
    if (err) {
      return callback(null, null, err)    
    }

    if(result.length >= 1) {
      return callback(null, result)
    } 

    callback(result)   
  })
}

function has_requested(userId, tourId, callback) {
  const sql = `SELECT * FROM Requests WHERE User_Id=${mysql.escape(userId)} AND Tournament_ID=${mysql.escape(tourId)}`;
  db.executeSql(sql, function(result, err) {
    if (err) {
      return callback(null, null, err)    
    }

    if(result.length >= 1) {
      return callback(null, result)
    } 

    callback(result)   
  })
}

function is_tournament_started(tourId, callback) {
  const sql = `SELECT * FROM Tournaments WHERE TournamentId=${mysql.escape(tourId)} AND Start > CURDATE()`;
  db.executeSql(sql, function(result, err) {
    if (err) {
      console.log(err)
      return callback(null, err)    
    }

    callback(result[0])   
  })
}