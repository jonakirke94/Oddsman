const express = require("express");
const router = express.Router();
const msg = require("../db/http");
const moment = require('moment');
const seq = require('../models');
const Tournament = seq.tournaments;
const Request = seq.requests;
const Bet = seq.bets;
const Tournament_User = seq.users_tournaments;
const helper = require('../controllers/helper');
const User = seq.users;
const {
    Op
} = require('sequelize')
const scraper = require('../services/scraper');


let today = moment();

exports.sendOdds = (req, res, next) => {
    const tourId = req.params.tourid;
    const odds = req.body.odds;
    const userId = helper.getUserId(req);

    let count = canOdds(odds.length, tourId, userId);

    if (count > 0) {
        return msg.show409(req, res, next, new Error("Mængden af odds for denne turnering er overskredet, ingen odds blev tilføjet"));
    }
    if (!isValidDate(tourId)) {
        return msg.show409(req, res, next, new Error("Det er ikke muligt at oddse på turneringen idag"));
    }

    // ADD INVALID & MISSING BOOL ON MATCH




    return msg.show200(req, res, next);
}


function canOdds(oddsAmount, tourId, userId, callback) {

    Tournament.count({
            where: {
                id: tourId,
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
            include: {
                model: Bet,
                where: {
                    userId: userId,
                    tournamentId: tourId,
                }
            }
        })
        .then((count) => {
            return count;
        });
}

function isValidDate(tourId) {
    // torsdag kl 12 - lørdag kl 12
    const startOfWeek = moment().startOf('isoWeek');
    let start = startOfWeek.add(3, 'd').add(12, 'h');
    let end = startOfWeek.add(5, 'd').add(12, 'h');

    let validDays = start <= today <= end;


    Tournament.findById(tourId).then(tourney => {
        return validDays && tourney.start <= today <= tourney.end;
    });


}

function saveOdds(userId, tourId, odds, callback) {
    odds.forEach(odds => {
        let matchId = odds.matchId;
        let option = odds.options;
        scraper.getMatch(matchId, null, (m) => {
            if (!m) {
                m = {
                    matchId: m.id,
                    userId: userId,
                    tournamentId: tourid,
                    missing: true
                }
            }

            Match.create(m)
                .then(match => {
                    Bet.create({
                        matchId: match.id,
                        userId: userId,
                        tournamentId: tourid
                    }).then(bet => {

                    });
                });
        });
    });
}