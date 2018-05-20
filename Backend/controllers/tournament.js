const express = require("express");
const router = express.Router();
const msg = require("../db/http");
const moment = require('moment');
const helper = require('../controllers/helper');
const seq = require('../models');
const TournamentTable = seq.tournaments;
const MatchTable = seq.matches;
const BetTable = seq.bets;
const ResultTable = seq.results;
const RequestTable = seq.requests;
const TournamentUserTable = seq.users_tournaments;
const UserTable = seq.users;
const {
  Op
} = require('sequelize')



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
  TournamentTable
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

  TournamentTable.findAll({
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
  const userId = helper.get_user_id(req);

  if (userId === -1) {
    return msg.show500(req, res, "Could not decode token");
  }

  const tourId = req.params.tourid

  helper.has_requested(userId, tourId).then(hasRequest => {
    if (hasRequest) {
      return msg.show409(req, res, 'User already has a request');
    }

    helper.is_enlisted(userId, tourId).then(isEnlisted => {
      if (isEnlisted) {
        return msg.show409(req, res, 'User is already enlisted');
      }

      helper.is_started_or_null(tourId).then(result => {
        if (result) {
          return msg.show409(req, res, 'Tournament already started or doesnt exist');
        }

        //insert request
        const request = {
          tournamentId: tourId,
          userId: userId,
          Status: 'pending'
        }

        RequestTable.create(request, {
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

  TournamentTable.findOne({
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
  const userId = helper.get_user_id(req);
  const today = moment();

  TournamentTable.findOne({
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
      model: TournamentUserTable,
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
  TournamentTable.findById(tourId, {
    attributes: [
      ['id', 'tourId'],
      ['name', 'tourName'], 'start'
    ],
    include: {
      model: UserTable,
      attributes: [
        ['id', 'userId'],
        ['name', 'userName'],
        ['tag', 'userTag'],
        ['email', 'userEmail']
      ],
      through: {
        attributes: [],
        model: RequestTable,
        where: {
          Status: {
            [Op.eq]: "pending"
          }
        }
      }
    },

  }).then(requests => {
    return msg.show200(req, res, "Success", requests);
  }).catch(function (err) {
    console.log(err)
    return msg.show500(req, res, err);
  })
}

exports.get_users_requests = (req, res, next) => { // TODO: Test with an accepted user on tournament 1
  const userId = helper.get_user_id(req);
  if (userId === -1) {
    return msg.show500(req, res, "Could not decode token");
  }

  UserTable.findById(userId, {
    attributes: [],
    include: {
      model: TournamentTable,
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
    return msg.show200(req, res, "Success", requests);
  }).catch(function (err) {
    return msg.show500(req, res, err);
  })
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

  RequestTable.update({
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

  helper.is_enlisted(userId, tourId).then(isEnlisted => {
    if (isEnlisted) {

      return msg.show409(req, res, 'User is already enlisted');
    }

    helper.is_started_or_null(tourId).then(result => {
      if (result) {
        return msg.show409(req, res, 'Tournament already started or doesnt exist');
      }

      //set request to accepted
      RequestTable.update({
          Status: 'accepted'
        }, {
          where: {
            tournamentId: tourId,
            userId: userId
          }
        })
        .then(request => {

          //add user to tournament
          TournamentTable.findById(tourId).then((tournament) => {
              tournament.addUser(userId).then(() => {
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
  const userId = helper.get_user_id(req);

  if (userId === -1) {
    return msg.show400(req, res, 'No token provided');
  }

  UserTable.findById(userId, {
    attributes: [],
    include: {
      model: TournamentTable,
      attributes: ['Id', 'Name', 'Start', 'End'],
      through: {
        model: TournamentUserTable,
        where: {
          UserId: userId
        },
        attributes: [],
      }
    }
  }).then(tourneys => {
    return msg.show200(req, res, "Success", tourneys);
  }).catch(err => {
    return msg.show500(req, res, err);
  }).catch(err => {
    return msg.show500(req, res, err);
  })
}

exports.get_delisted_tournaments = (req, res, next) => {
  //get tournaments the user is not participating in, which have not started or been requested to
  const userId = helper.get_user_id(req);

  if (userId === -1) {
    return msg.show500(req, res, err);
  }
  RequestTable.findAll({
    where: {
      userId: userId
    },
    through: {
      model: TournamentTable,
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
    TournamentTable.findAll({
      where: {
        id: {
          [Op.notIn]: reqsArr
        }
      },
      attributes: ['id', 'name', 'start', 'end'],
      include: {
        model: UserTable,
        attributes: ['name', 'tag', 'email']
      }
    }).then(tourneys => {
      return msg.show200(req, res, "Success", tourneys);
    }).catch(err => {
      return msg.show500(req, res, err);
    })
  })
}

exports.get_overview = (req, res, next) => {
  const tourId = req.params.tourid;
  TournamentTable.findById(tourId, {
      attributes: ['id', 'name', 'start', 'end'],
      include: {
        through: {
          model: TournamentUserTable
        },
        model: UserTable,
        attributes: ['id', 'tag', 'name'],
        include: {
          model: BetTable,
          required: false,
          attributes: ['id', 'week', 'option', 'optionNo', 'matchId'],
          where: {
            tournamentId: tourId
          },
          include: {
            model: MatchTable,
            required: false,
            where: {
              Missing: false,
              Invalid: false
            },
            attributes: ['id', 'Option1Odds', 'Option2Odds', 'Option3Odds'],
            include: {
              model: ResultTable,
              required: false,
              attributes: ['id', 'correctBet']
            }
          }

        }
      }
    })
    .then((tourney) => {
      generate_standings(tourney, (standings) => {
        return msg.show200(req, res, "Success", standings);
      });
    })
    .catch(err => {
      return msg.show500(req, res, err);
    });
}

function generate_standings(tourney, callback) {
  const end = tourney.dataValues.end;

  const ongoing = new Date(end) > new Date() ? true : false;
  const week = moment().isoWeek();

  const tournament = {
    id: tourney.dataValues.id,
    name: tourney.dataValues.name,
    ongoing: ongoing,
    week: week,
    standings: []
  }

  const users = tourney.dataValues.users;

  for (let i = 0; i < users.length; i++) {
    const u = users[i].dataValues || {};
    const bets = u.bets || [];
    const standing = {
      tag: u.tag,
      name: u.name,
      tips: u.bets.length,
      wins: 0,
      points: 0.0,
      pointsWeek: 0.0
    }
    // Try settings standings based on each users existing bets/match/result.
    for (let j = 0; j < bets.length; j++) {
      try {
        const b = bets[j].dataValues;
        const m = b.match.dataValues;
        const r = m.result.dataValues;
        const odds = {
          "1": m.Option1Odds || 0.0,
          "X": m.Option2Odds || 0.0,
          "2": m.Option3Odds || 0.0
        }
        if (b.option === r.correctBet) {
          if (b.week === moment().isoWeek()) {
            standing.pointsWeek += odds[b.option] || 0;
          }
          standing.points += odds[b.option] || 0;
          standing.wins++;
        }
      } catch (error) {
        continue;
      }
    }
    tournament.standings.push(standing);

  }

  // Sort by most points
  tournament.standings.sort(function (a, b) {
    if (a.points < b.points) return 1;
    if (a.points > b.points) return -1;
    return 0;
  });
  // Set positions and remaining points till #1 AFTER sorting
  let topPoints = 0;
  for (let i = 0; i < tournament.standings.length; i++) {
    const s = tournament.standings[i];
    s['position'] = i + 1;
    if (i === 0) {
      topPoints = s.points;
      s['deficit'] = 0;
    } else {
      s['deficit'] = topPoints - s.points;
    }
  }

  callback(tournament);
}



