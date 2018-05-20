process.env.NODE_ENV = "test";

const config = require("config");
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server");
const should = chai.should();
const db = require('../models');
const tokenController = require('../controllers/token')
const token = require("../controllers/token");
const helper = require('../test/helper');
const moment = require('moment');
const Tournament = db.tournaments;
const Match = db.matches;
const Bet = db.bets;
const Result = db.results;
const Request = db.requests;
const Tournament_User = db.users_tournaments;
const User = db.users;

chai.use(chaiHttp);

const token1 = tokenController.generate_tokens({
    Email: "Bryan@gmail.dk",
    Id: 1,
    IsAdmin: false
});

const token2 = tokenController.generate_tokens({
    Email: "World@gmail.dk",
    Id: 2,
    IsAdmin: false
});

const user1 = {
    name: "BRYBRY",
    email: "Bryan@gmail.dk",
    id: 1,
    isAdmin: false,
    tag: "MYBOI",
    password: "123456789"
};
const user2 = {
    name: "KirkeBoss",
    email: "World@gmail.dk",
    id: 2,
    isAdmin: false,
    tag: "JKIRK",
    password: "123456789"
};

/************************************************
 * ENDPOINT EXPLANATION
 * 1: CREATE A TOURNAMENT
 * 2: CREATE A USER
 * 3: CREATE A REQUEST
 * 4: MANAGE REQUEST
 * 5: GET ALL TOURNAMENTS
 * 6: GET ENLISTED TOURNAMENTS FOR A USER
 * 7: GET DELISTED TOURNAMENTS FOR A USER
 ************************************************/

describe('TOURNAMENTS', () => {
    beforeEach(done => {
        helper.clean(function (result) {
            let matchId = null;

            Tournament.create({
                Name: "Active",
                Start: moment().subtract(1, 'M'),
                End: moment().add(1, 'M')
            }).then(() => {
                chai
                    .request(server)
                    .post("/user/signup") //ENDPOINT[2]
                    .send(user1)
                    .end((err, res) => {
                        chai
                            .request(server)
                            .post("/user/signup") //ENDPOINT[2]
                            .send(user2)
                            .end((err, res) => {
                                Tournament_User.create({
                                    userId: 1,
                                    tournamentId: 1
                            }).then(() => {
                                Tournament_User.create({
                                    userId: 2,
                                    tournamentId: 1
                            }).then(() => {
                                Match.create({
                                    Option1Odds: 1.98,
                                    Option2Odds: 2.11,
                                    Option3Odds: 36.12
                            }).then((match) => {
                                    matchId = match.Id;
                                    Result.create({
                                        EndResult: "2 - 0",
                                        CorrectBet: "X",
                                        matchId: 1
                                })
                            .then(() => {
                                Bet.create({
                                    tournamentId: 1,
                                    userId: 1,
                                    Week: moment().isoWeek(),
                                    Option: "X",
                                    OptionNo: 2,
                                    matchId: matchId
                                })
                            .then(() => {
                                Bet.create({
                                    tournamentId: 1,
                                    userId: 2,
                                    Week: moment().isoWeek(),
                                    Option: "1",
                                    OptionNo: 1,
                                    matchId: matchId
                                })
                            .then(() => {
                                done();
                            })
                            })
                            })
                            })
                            });
                            });
                            });
                        });
                });
        })
    });
    afterEach(function (done) {
        helper.clean(function (result) {
            done();
        })
    });

    describe("/GET tournament overview", () => {
        it("it should get an overview of the tournament standings within the last 4 weeks", done => {
            chai
                .request(server)
                .get("/tournament/1/overview")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.data.should.be.a('object');
                    res.body.data.standings.should.be.a('array');
                    res.body.data.standings.should.have.length(2);
                    res.body.msg.should.be.eql("Success");
                    done();
                });
        });
    });
});