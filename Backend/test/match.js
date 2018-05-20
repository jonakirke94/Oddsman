process.env.NODE_ENV = "test";

const config = require("config");
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server");
const should = chai.should();
const moment = require("moment");

const tokenController = require("../controllers/token");
const userController = require("../controllers/user");
const seq = require('../models');
const Bet = seq.bets;
const Tournament = seq.tournaments;
const Match = seq.matches;
const Result = seq.results;

const helper = require('../test/helper');

chai.use(chaiHttp);

const tokens = tokenController.generate_tokens({
    Email: "Bryan@email.dk",
    Id: 1,
    IsAdmin: false
});

/* seq.sequelize.sync(); */

describe('MATCHES/RESULTS', () => {
    beforeEach(done => {
        helper.clean(function (result) {
            let matchId = null;
            const tour = helper.getTour();
            const user = helper.getUser();
            const user2 = helper.getUser({
                name: "Günther",
                tag: "? u wot mate ?",
                email: "ebaumsworld@90skids.com",
                password: "halloweldt"
            });
            chai.request(server)
                .post("/tournament") //ENDPOINT[1]
                .send(tour)
                .end((err, res) => {
                    Tournament.bulkCreate([{
                        Name: "Season " + moment().isoWeek(),
                        Start: moment().subtract(1, 'M'),
                        End: moment().add(1, 'M')
                    }, {
                        Name: "Season 17",
                        Start: moment().subtract(5, 'M'),
                        End: moment().subtract(2, 'M')
                    }]).then(() => {
                        chai.request(server)
                            .post("/user/signup") //ENDPOINT[2]
                            .send(user)
                            .end((err, res) => {
                                Match.create({
                                        MatchId: 1,
                                        Missing: true
                                    })
                                    .then((match) => {
                                        matchId = match.Id;
                                        Bet.create({
                                            tournamentId: 1,
                                            userId: 1,
                                            Week: moment().isoWeek(),
                                            Option: "1",
                                            OptionNo: 1,
                                            matchId: matchId
                                        }).then(() => {
                                            Bet.bulkCreate([{
                                                tournamentId: 2,
                                                userId: 1,
                                                Week: moment().isoWeek(),
                                                Option: "X",
                                                OptionNo: 2,
                                                matchId: matchId
                                            }, {
                                                tournamentId: 2,
                                                userId: 1,
                                                Week: moment().isoWeek(),
                                                Option: "X",
                                                OptionNo: 2,
                                                matchId: matchId
                                            }, {
                                                tournamentId: 2,
                                                userId: 1,
                                                Week: moment().isoWeek(),
                                                Option: "3",
                                                OptionNo: 3,
                                                matchId: matchId
                                            }]).then(() => {

                                                Result.bulkCreate([{
                                                        Id: 1,
                                                        EndResult: "2 - 0",
                                                        CorrectBet: "1",
                                                        matchId: matchId,
                                                        Missing: true
                                                    }])
                                                    .then(() => {
                                                        done();
                                                    });
                                            });

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

    describe("/PATCH Match", () => {
        it("it should update a match", done => {
            chai
                .request(server)
                .patch("/match/1")
                .send({
                    option1: "vinder",
                    option2: "uafgjort",
                    option3: "taber",
                    option1Odds: 3.14,
                    option2Odds: 8.34,
                    option3Odds: 3.45
                })
                .end((err, res) => {
                    let data = JSON.parse(res.text).data;
                    res.should.have.status(200);
                    data.Option2Odds.should.be.eql(8.34);
                    done();
                });
        });
    });
    describe("/GET Match", () => {
        it("it should get all missing matches", done => {
            chai
                .request(server)
                .get("/match/missing")
                .end((err, res) => {
                    let data = JSON.parse(res.text).data;
                    res.should.have.status(200);
                    data.should.be.a('array');
                    done();
                });
        });
    });

    describe("/PATCH Result", () => {
        it("it should update a Result", done => {
            chai
                .request(server)
                .patch("/match/result/1")
                .send({
                    correctBet: "1",
                    endResult: "2 - 0"
                })
                .end((err, res) => {
                    let data = JSON.parse(res.text).data;
                    res.should.have.status(200);
                    data.CorrectBet.should.be.eql("1");
                    data.EndResult.should.be.eql("2 - 0");
                    done();
                });
        });
    });
    describe("/GET Results", () => {
        it("it should get all missing Results", done => {
            chai
                .request(server)
                .get("/match/result/missing")
                .end((err, res) => {
                    let data = JSON.parse(res.text).data;
                    res.should.have.status(200);
                    data.should.be.a('array');
                    data.length.should.eql(1);
                    done();
                });
        });
    });
});