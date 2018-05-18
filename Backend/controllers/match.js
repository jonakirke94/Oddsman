const express = require("express");
const router = express.Router();
const msg = require("../db/http");
const moment = require('moment');
const seq = require('../models');
const Tournament = seq.tournaments;
const Request = seq.requests;
const Bet = seq.bets;
const Match = seq.matches;
const Tournament_User = seq.users_tournaments;
const helper = require('../controllers/helper');
const User = seq.users;
const Result = seq.results;
const {
    Op
} = require('sequelize')
const scraper = require('../services/scraper');


let today = moment();

exports.edit_match = (req, res, next) => {
    const tourId = req.params.tourid;
    const matchId = req.params.matchid;
    // Convert match values to all lowercase
    const match = keysToLower(req.body);

    Match.findById(matchId)
        .then((m) => {
            if (!m) return msg.show404(req, res, "The match could not be found");
            // foreach key in the database match
            Object.keys(m.dataValues).forEach((key) => {
                try {
                    // Convert the key to lowercase
                    const k = key.toLowerCase();
                    // Access the new match's values
                    const val = match[k];
                    // Set the original match keys to the new values if the new value isn't null/undefined etc.
                    if (val) {
                        m[key] = val;
                    }
                } catch (error) {
                    console.log("failed patching match: " + error);
                }
            });

            if (m.Option1Odds && m.Option2Odds && m.Option3Odds && m.MatchName && m.MatchDate) {
                m.Missing = false;
            }

            m.save().then(() => {
                return msg.show200(req, res, "Success", m);
            });
        })
        .catch(err => {
            return msg.show500(req, res, err);
        })
}

exports.get_missing_matches = (req, res, next) => {
    Match.findAll({
        where: {
            Missing: true
        }
    }).then((matches) => {
        return msg.show200(req, res, "Success", matches);

    }).catch(err => {
        return msg.show500(req, res, err);
    })
}

exports.get_results = (req, res, next) => {
    const limit = 5;

    Match.findAll({
        attributes: [['MatchName', 'Name']],
        limit: limit,
        order: [
            ['updatedAt', 'DESC']
        ],
        include: {
            model: Result,
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
                console.log(error)
            }
        })
        return msg.show200(req, res, "Success", matchArr);
    }).catch(err => {
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