const express = require("express");
const router = express.Router();
const msg = require("../db/http");
const moment = require('moment');
const seq = require('../models');
const Tournament = seq.tournaments;
const Match = seq.matches;
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

    Tournament.findById(tourId, {
            include: {
                model: Bet,
                attributes: ['userId', 'tournamentId', 'week']
            }
        })
        .then(tourney => {
            if (tourney) {
                let validDay = isValidWeekDays();

                if (!validDay) {
                    return msg.show409(req, res, "Det er ikke muligt at oddse på turneringen idag");
                }

                let active = isActiveTournament(tourney.dataValues.Start, tourney.dataValues.End);

                if (!active) {
                    return msg.show409(req, res, "Turneringen er inaktiv");
                }

                let count = tourney.dataValues.bets.length;

                if (count > 0) {
                    return msg.show409(req, res, `Mængden af odds for denne turnering er overskredet ${count}/3`);
                }

                let ctr = 0;
                odds.forEach((o, index, odds) => {
                    let matchId = o.matchId;
                    let option = o.option;

                    scraper.getMatch(matchId, null, (m) => {
                        if (m === null) {
                            m = {
                                matchId: matchId,
                                userId: userId,
                                tournamentId: tourId,
                                missing: true
                            }
                        }
                        Match.create(m)
                            .then(match => {
                                Bet.create({
                                    matchId: match.id,
                                    userId: userId,
                                    tournamentId: tourId,
                                    Week: moment().isoWeek()
                                }).then(() => {
                                    ctr++;
                                    if (ctr === odds.length) {
                                        return msg.show200(req, res, next);
                                    }
                                });
                            });
                    });

                });



            } else {
                return msg.show404(req, res, next);
            }

        });
}


function isValidWeekDays() {
    // torsdag kl 12 - lørdag kl 12
    let start = moment().startOf('isoWeek').add(3, 'd').add(12, 'h');
    let end = moment().startOf('isoWeek').add(5, 'd').add(23, 'h').add(59, 'm');
    return today.isBetween(start, end, null, '[]'); // inclusive
}

function isActiveTournament(start, end) {
    return today.isBetween(start, end, null, '[]');
}

function saveOdds(userId, tourId, odds, callback) {
    odds.forEach(odds => {
        let matchId = odds.matchId;
        let option = odds.option;
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
                        // TODO: UPDATE FEED & ALERT USER?
                    });
                });
        });
    });
}