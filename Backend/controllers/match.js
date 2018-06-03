const express = require("express");
const router = express.Router();
const msg = require("../db/http");
const moment = require('moment');
const seq = require('../models');
const helper = require('../controllers/helper');
const TournamentTable = seq.tournaments;
const RequestTable = seq.requests;
const BetTable = seq.bets;
const MatchTable = seq.matches;
const TournamentUserTable = seq.users_tournaments;
const UserTable = seq.users;
const ResultTable = seq.results;
const {
    Op
} = require('sequelize')
const scraper = require('../services/scraper');

let today = moment();

exports.edit_match = (req, res, next) => {
    const matchId = req.params.matchid;
    // Convert match values to all lowercase
    const match = req.body;
    MatchTable.findById(matchId)
        .then((m) => {
            if (!m) return msg.show404(req, res, "The match could not be found");
            patchObject(match, m.dataValues, (patch) => {
                if (patch.Option1Odds && patch.Option1Odds && patch.Option1Odds && patch.MatchName && patch.MatchDate) {
                    patch['Missing'] = false;
                }
                m.update(patch).then(() => {
                    return msg.show200(req, res, "Success", m);
                });
            });
        })
        .catch(err => {
            return msg.show500(req, res, err);
        })
}

exports.get_missing_matches = (req, res, next) => {
    MatchTable.findAll({
        where: {
            Missing: true
        }
    }).then((matches) => {
        return msg.show200(req, res, "Success", matches || []);

    }).catch(err => {
        return msg.show500(req, res, err);
    })
}

exports.get_missing_results = (req, res, next) => {
    ResultTable.findAll({
        where: {
            Missing: true
        }
    }).then((results) => {
        return msg.show200(req, res, "Success", results || []);
	}).catch(err => {
        return msg.show500(req, res, err);
    });
}

exports.get_results = (req, res, next) => {
    const limit = 5;

    MatchTable.findAll({
        attributes: [['MatchName', 'Name']],
        limit: limit,
        order: [
            ['updatedAt', 'DESC']
        ],
        include: {
            model: ResultTable,
            attributes: [['EndResult', 'Score'], ['updatedAt', 'Updated']],
            required: true,
            where: {
                Missing: false
            }
        }
    }).then(matches => {
        matchArr = [];

        matches.forEach((match, index, matches) => {
            try {
                const m = match.dataValues;
                const r = m.result.dataValues;

                matchArr.push({
                    name: m.Name,
                    score: r.Score,
                    updated: r.Updated
                })
            } catch (error) {
                console.log("get results: " + error)
            }
        })
        return msg.show200(req, res, "Success", matchArr);
    }).catch(err => {
        return msg.show500(req, res, err);
    })
}

exports.edit_result = (req, res, next) => {
    const resultId = req.params.resultid;
    const result = req.body;

    ResultTable.findById(resultId)
        .then((r) => {
            if (!r) return msg.show404(req, res, "The result could not be found");
            patchObject(result, r.dataValues, (patch) => {
                if (patch.CorrectBet && patch.EndResult) {
                    patch['Missing'] = false;
                }
                r.update(patch).then(() => {
                    return msg.show200(req, res, "Success", r);
                });
            });
        })
        .catch(err => {
            return msg.show500(req, res, err);
        })

}


/* HELPERS */

function keysToLower(obj) {
    let key, keys = Object.keys(obj);
    let n = keys.length;
    let newObj = {}
    while (n--) {
        key = keys[n];
        newObj[key.toLowerCase()] = obj[key];
    }
    return newObj;
}

function patchObject(newObj, obj, callback) {
    const loweredObj = keysToLower(newObj);
    const patchedObj = {};
    Object.keys(obj).forEach((key) => {
        try {
            const k = key.toLowerCase();
            const val = loweredObj[k];
            if (val) {
                patchedObj[key] = val;
            }
        } catch (error) {
            console.log(`Failed patching Obj: ${obj}\nWith newObj: ${newObj}\nError: ${error}`);
        }
    });

    callback(patchedObj);
}