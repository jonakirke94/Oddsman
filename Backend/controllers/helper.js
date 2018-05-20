const jwtDecode = require('jwt-decode');
const seq = require('../models');
const RequestTable = seq.requests;
const TournamentUserTable = seq.users_tournaments;
const TournamentTable = seq.tournaments;

const {
    Op
  } = require('sequelize')
  


exports.get_user_id = (req) => {
    //decode the token and fetch id
    const token = req.headers.authorization.split(' ');

    try {
        var decoded = jwtDecode(token[1])
        return decoded.userId;
    } catch (err) {
        return -1;
    }
}

exports.has_requested = (userId, tourId) => {
  return RequestTable.count({
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

exports.is_enlisted = (userId, tourId) => {
    return TournamentUserTable.count({
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

exports.is_started_or_null = (tourId) => {

    const today = new Date(new Date().toDateString());
    return TournamentTable.find({
        where: {
            Id: tourId,
            Start: {
                [Op.gt]: today
            }
        }
    })
        .then(tour => {
            return tour === null
        })
        .then(doesExist => {
            return doesExist
        })
}



exports.is_valid_weekdays = () => {
    // torsdag kl 12 - lørdag kl 12
    let start = moment().startOf('isoWeek').add(3, 'd').add(12, 'h');
    let end = moment().startOf('isoWeek').add(5, 'd').add(23, 'h').add(59, 'm');
    return today.isBetween(start, end, null, '[]'); // inclusive
}

exports.is_active_tournament = (start, end) => {
    return today.isBetween(start, end, null, '[]');
}