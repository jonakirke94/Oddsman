const express = require("express");
const router = express.Router();
const db = require("../db/db");
const msg = require("../db/http");
const mysql = require("mysql");
const jwtDecode = require('jwt-decode');
const moment = require('moment');

const seq = require('../models');
const Tournament = seq.tournaments;
const Match = seq.matches;
const Bet = seq.bets;
const Result = seq.results;
const Request = seq.requests;
const Tournament_User = seq.users_tournaments;
const User = seq.users;
const {
  Op
} = require('sequelize')

const helper = require('../controllers/helper');



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

  const newTournament = {
    Name: name,
    Start: startDate,
    End: endDate
  }
  Tournament
    .create(newTournament, {
      logging: false
    })
    .then(tour => {
      return msg.show200(req, res, "Success", tour);
    })
    .catch(seq.Sequelize.ValidationError, function (err) {
      return msg.show409(req, res, "Validation Error", err.errors[0].message);
    }).catch(function (err) {
      return msg.show500(req, res, err);
    })
};

exports.get_all = (req, res, next) => {

  Tournament.findAll({
    attributes: ['Id', 'Name', 'Start', 'End'],
    include: {
      model: seq.users,
      attributes: ['Name', 'Email', 'Tag'],
      through: {
        attributes: []
      },
    },
  }).then(results => {
    return msg.show200(req, res, "Success", results);
  }).catch(function (err) {
    return msg.show500(req, res, err);
  })

}

exports.request = (req, res, next) => {
  const userId = getUserId(req);

  if (userId === -1) {
    return msg.show500(req, res, "Could not decode token");
  }

  const tourId = req.params.tourid

  has_requested(userId, tourId).then(hasRequest => {
    if (hasRequest) {
      return msg.show409(req, res, 'User already has a request');
    }

    is_enlisted(userId, tourId).then(isEnlisted => {
      if (isEnlisted) {
        return msg.show409(req, res, 'User is already enlisted');
      }

      isTourStartedOrNull(tourId).then(result => {
        if (result) {
          return msg.show409(req, res, 'Tournament already started or doesnt exist');
        }

        //insert request
        const request = {
          tournamentId: tourId,
          userId: userId,
          Status: 'pending'
        }

        Request.create(request, {
            logging: false
          })
          .then(req => {
            return msg.show200(req, res, "Success", req.dataValues);
          })
          .catch(function (err) {

            if (err.name === 'SequelizeForeignKeyConstraintError') {
              return msg.show400(req, res, err);

            } else {
              return msg.show500(req, res, err);
            }

          })
      })
    })
  })
}

exports.get_current_tournament = (req, res, next) => {
  const today = moment();

  Tournament.findOne({
    attributes: ['id', 'name'],
    where: {
      Active: true
    }
    }).then(tour => {

    if (tour === null) {
      return msg.show404(req, res, next);
    }

    return msg.show200(req, res, "Found active tournament", tour);

  }).catch(function (err) {
    return msg.show500(req, res, err);
  })
}

exports.get_current_tournament_user = (req, res, next) => {
  const userId = helper.getUserId(req);
  const today = moment();

  Tournament.findOne({
    attributes: ['id', 'name'],
    where: {
      [Op.and]: [{
          start: {
            [Op.lte]: today.toDate()
          }
        },
        {
          end: {
            [Op.gte]: today.toDate()
          }
        }
      ]
    },
    through: {
      attributes: [''],
      model: Tournament_User,
      where: {
        userId: userId
      },
    }

  }).then(tour => {
    if (tour === null) {
      return msg.show404(req, res, next);
    }

    return msg.show200(req, res, "Found current tournament", tour);

  }).catch(function (err) {
    return msg.show500(req, res, err);
  })
}

exports.get_tournament_requests = (req, res, next) => {
  const tourId = req.params.tourid;
  Tournament.findById(tourId, {
    attributes: [
      ['id', 'tourId'],
      ['name', 'tourName'], 'start'
    ],
    include: {
      model: User,
      attributes: [
        ['id', 'userId'],
        ['name', 'userName'],
        ['tag', 'userTag'],
        ['email', 'userEmail']
      ],
      through: {
        attributes: [],
        model: Request,
        where: {
          Status: {
            [Op.eq]: "pending"
          }
        }
      }
    },

  }).then(requests => {
    //console.log(JSON.stringify(requests));
    return msg.show200(req, res, "Success", requests);
  }).catch(function (err) {
    console.log(err)
    return msg.show500(req, res, err);
  })
}

exports.get_users_requests = (req, res, next) => { // TODO: Test with an accepted user on tournament 1
  const userId = getUserId(req);
  if (userId === -1) {
    return msg.show500(req, res, "Could not decode token");
  }

  User.findById(userId, {
    attributes: [],
    include: {
      model: Tournament,
      attributes: ['Id', 'Name', 'Start', 'End'],
      through: {
        where: {
          UserId: userId,
          status: 'pending'
        },
        attributes: ['Status'],
      }
    }
  }).then(requests => {
    //console.log(JSON.stringify(requests))
    return msg.show200(req, res, "Success", requests);
  }).catch(function (err) {
    return msg.show500(req, res, err);
  })

  /* Tournament.findAll({    
    through: {
      model: Request,
      where: {status: "pending", userId: userId}
    },
    through:{
      model: Tournament_User,
      include: {
        model: User,
        attributes: ['id', 'name', 'tag', 'email']
      }
    }
  }).then(requests => {
    console.log(JSON.stringify(requests))
    return msg.show200(req, res, "Success", requests);
  }).catch(function (err) {
    return msg.show500(req, res, err);
  }) */
}

exports.manage_request = (req, res, next) => {
  const status = req.body.status;

  if (status === 'accepted') {
    return accept_request(req, res, next);
  } else {
    return decline_request(req, res, next);
  }
}

function decline_request(req, res, next) {
  const tourId = req.params.tourid;
  const userId = req.params.userid;

  Request.update({
    Status: "declined"
  }, {
    where: {
      tournamentId: tourId,
      userId: userId
    }
  }).then(
    () => {
      return msg.show200(req, res, "Success");
    }).catch(err => {
    return msg.show500(req, res, err);
  })
}

function accept_request(req, res, next) {
  const tourId = req.params.tourid;
  const userId = req.params.userid;

  is_enlisted(userId, tourId).then(isEnlisted => {
    if (isEnlisted) {

      return msg.show409(req, res, 'User is already enlisted');
    }

    isTourStartedOrNull(tourId).then(result => {
      if (result) {
        return msg.show409(req, res, 'Tournament already started or doesnt exist');
      }

      //set request to accepted
      Request.update({
          Status: 'accepted'
        }, {
          where: {
            tournamentId: tourId,
            userId: userId
          }
        })
        .then(request => {

          //add user to tournament
          Tournament.findById(tourId).then((tournament) => {
              tournament.setUsers(userId).then(() => {
                return msg.show200(req, res, "Success");
              }).catch(function (err) {
                if (err.name === 'SequelizeForeignKeyConstraintError') {
                  return msg.show400(req, res, err.name);
                } else {
                  return msg.show500(req, res, err);
                }

              })
            })
            .catch(function (err) {
              return msg.show500(req, res, err);
            })
        })
    })

  })
};

exports.get_enlisted_tournaments = (req, res, next) => {
  const userId = getUserId(req);


  if (userId === -1) {
    return msg.show400(req, res, 'No token provided');
  }

  User.findById(userId, {
    attributes: [],
    include: {
      model: Tournament,
      attributes: ['Id', 'Name', 'Start', 'End'],
      through: {
        model: Tournament_User,
        where: {
          UserId: userId
        },
        attributes: [],
      }
    }
  }).then(tourneys => {
    //console.log(JSON.stringify(tourneys));
    return msg.show200(req, res, "Success", tourneys);
  }).catch(err => {
    return msg.show500(req, res, err);
  }).catch(err => {
    return msg.show500(req, res, err);
  })

  /*  Tournament.findAll({
     through: {
       model: Tournament_User,
       where: {
         userId: userId
       }
     }
   }).then(tourneys => {
    // console.log(JSON.stringify(tourneys));
     return msg.show200(req, res, "Success", tourneys);
   }).catch(err => {
     return msg.show500(req, res, err);
   }).catch(err => {
     return msg.show500(req, res, err);
   }) */
}




exports.get_delisted_tournaments = (req, res, next) => {
  //get tournaments the user is not participating in, which have not started or been requested to
  const userId = getUserId(req);

  if (userId === -1) {
    return msg.show500(req, res, err);
  }
  Request.findAll({
    where: {
      userId: userId
    },
    through: {
      model: Tournament,
      where: {
        Start: {
          [Op.gt]: Date.now()
        }
      }
    },
    attributes: ['userId', 'tournamentId']
  }).then(reqs => {
    let reqsArr = [];
    reqs.forEach(r => {
      reqsArr.push(r.dataValues.tournamentId);
    });
    Tournament.findAll({
      where: {
        id: {
          [Op.notIn]: reqsArr
        }
      },
      attributes: ['id', 'name', 'start', 'end'],
      include: {
        model: User,
        attributes: ['name', 'tag', 'email']
      }
    }).then(tourneys => {
      console.log(JSON.stringify(tourneys));
      return msg.show200(req, res, "Success", tourneys);
    }).catch(err => {
      return msg.show500(req, res, err);
    })
  })
}


exports.get_overview = (req, res, next) => {
  const tourId = req.params.tourid;
  Tournament.findById(tourId, {
      attributes: ['id', 'start', 'end'],
      include: {
        through: {
          model: Tournament_User
        },
        model: User,
        attributes: ['id', 'tag', 'name'],
        include: {
          model: Bet,
          required: false,
          attributes: ['id', 'week', 'option', 'optionNo', 'matchId'],
          where: {
            Week: {
              [Op.gte]: moment().isoWeek() - 4 // get a months worth of bets (4 rounds).
            }
          },
          include: {
            model: Match,
            required: false,
            where: {
              Missing: false,
              Invalid: false
            },
            attributes: ['id', 'Option1Odds', 'Option2Odds', 'Option3Odds' ],
            include: {
              model: Result,
              required: false,
              attributes: ['id', 'correctBet']
            }
          }

        }
      }
    })
    .then((tourney) => {
      generateStandings(tourney, (standings) => {
        console.log(standings)
        return msg.show200(req, res, "Success", standings);
      });      
    })
    .catch(err => {
      return msg.show500(req, res, err);
    });
}

function generateStandings(tourney, callback) {
  const tournament = {
    id: tourney.dataValues.id,
    start: tourney.dataValues.start,
    end: tourney.dataValues.end,
    standings: []
  }

  const users = tourney.dataValues.users;

  console.log(users.length)

  for (let i = 0; i < users.length; i++) {
    const u = users[i].dataValues;
    console.log(u)
    const bets = u.bets;
    const standing = {
      tag: u.tag,
      name: u.name,
      tips: u.bets.length,
      wins: 0,
      points: 0.0,
      pointsWeek: 0.0
    }    

    for (let j = 0; j < bets.length; j++) {
      const b = bets[j].dataValues;
      const m = b.match.dataValues;
      const r = m.result.dataValues;
      const odds = {
        "1": m.Option1Odds,
        "X": m.Option2Odds,
        "2": m.Option3Odds
      }            
      
      if(b.option === r.correctBet){
        if(b.week === moment().isoWeek()){
          standing.pointsWeek += odds[b.option] || 0;
        }
        standing.points += odds[b.option] || 0;
        standing.wins++;
      }
    }
    tournament.standings.push(standing);
  }
  callback(tournament);
}




/* HELPERS */

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


function has_requested(userId, tourId) {
  return Request.count({
    where: {
      tournamentId: tourId,
      userId: userId
    }
  }).then(count => {
    if (count == 0) {
      return false;
    }
    return true;
  });
}

function is_enlisted(userId, tourId) {
  return Tournament_User.count({
    where: {
      tournamentId: tourId,
      userId: userId
    }
  }).then(count => {
    if (count == 0) {
      return false;
    }
    return true;
  });
}

function isTourStartedOrNull(tourId) {
  const today = new Date(new Date().toDateString());
  return Tournament.find({
      where: {
        Id: tourId,
        Start: {
          [Op.gt]: today
        }
      } //$gt = g
    })
    .then(tour => {
      return tour === null
    })
    .then(doesExist => {
      return doesExist
    })
}