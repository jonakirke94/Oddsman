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
    Op,
    col,
    where
} = require('sequelize')
const scraper = require('../services/scraper');


let today = moment()/* .add(2, 'd').add(12, 'h'); */ // used for faking a valid bet day

exports.sendOdds = (req, res, next) => {
    const tourId = req.params.tourid;
    const odds = req.body;
    const userId = helper.getUserId(req);

    /* console.log(odds) */
    if (!odds.length) {
        return msg.show409(req, res, `Der blev ikke modtaget nogen odds`);
    }

    Tournament.findById(tourId, {
            include: {
                model: Bet,
                attributes: ['userId', 'tournamentId', 'week'],
                where: {
                    Week: today.isoWeek(),
                    userId: userId
                },
                required: false
            }
        })
        .then(tourney => {
            if (tourney) {
                let validDay = isValidWeekDays();

                if (!validDay) {
                    /* console.log("invalid day") */
                    return msg.show409(req, res, "Det er ikke muligt at oddse på turneringen idag");
                }

                let active = isActiveTournament(tourney.dataValues.Start, tourney.dataValues.End);

                if (!active) {
                    /* console.log("inactive tourney") */
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
                                MatchId: matchId,
                                Missing: true
                            }
                        }

                        if (!m.Missing) {
                            scraper.scheduleResultScrape(m.MatchId);
                        }

                        Match.create(m)
                            .then(match => {

                                Bet.create({
                                    matchId: match.Id,
                                    userId: userId,
                                    tournamentId: tourId,
                                    Week: moment().isoWeek(),
                                    Option: option,
                                    OptionNo: getOptionNumber(option)
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

function getOptionNumber(op) {
    switch (op) {
        case "1":
            return 1;
        case "X":
            return 2;
        case "2":
            return 3;
        default:
            return -1;
    }
}

exports.get_recent_bets_http = (req, res, next) => {
    try {
        module.exports.get_recent_bets(9, (results) => {
            return msg.show200(req, res, "Success", results);
        })
    } catch (err) {
        return msg.show500(req, res, err);
    }
}
exports.get_recent_bets = (limit = 3, callback) => {
    Bet.findAll({
        limit: limit,
        order: [
            ['createdAt', 'DESC']
        ],
        where: {
            week: moment().isoWeek()
        },
        attributes: ['option', 'createdAt'],
        include: [{
            model: User,
            attributes: ['tag'],
            where: {
                id: col('bets.userId')
            }
        }, {
            model: Match,
            attributes: ['id', 'matchId', 'matchName', 'option1Odds', 'option2Odds', 'option3Odds'],
            where: {
                id: col('bets.matchId')
            }
        }]
    }).then((bets) => {
        if (bets) {
            let results = [];
            bets.forEach((bet, index, bets) => {
                try {
                    const b = bet.dataValues;
                    const u = b.user.dataValues;
                    const m = b.match.dataValues;

                    const odds = {
                        "1": m.option1Odds,
                        "X": m.option2Odds,
                        "2": m.option3Odds
                    }

                    const res = {
                        time: b.createdAt,
                        tag: u.tag,
                        matches: [{
                            id: m.matchId,
                            match: m.matchName || "-",
                            bet: b.option,
                            odds: odds[b.option] || "-"
                        }]
                    }

                    let exists = function (e) {
                        return e.tag === res.tag;
                    }

                    if (results.some(exists)) {
                        for (let j = 0; j < results.length; j++) {
                            const r = results[j];
                            if (r.tag === res.tag) {
                                r.matches = r.matches.concat(res.matches);
                            }
                        }
                    } else {
                        results.push(res);
                    }

                } catch (error) {
                    console.log("failed parsing bet");
                }

                if (index === bets.length - 1) {
                    callback(results);
                }
            })
        } else {
            callback(results);
        }
    }).catch(err => {
        console.log(err);
    });
}