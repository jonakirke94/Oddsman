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

const helper = require('../test/helper');

chai.use(chaiHttp);

const tokens = tokenController.generate_tokens({
    Email: "Bryan@email.dk",
    Id: 1,
    IsAdmin: false
});

/* seq.sequelize.sync(); */

describe('BETS', () => {
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
                    Tournament.create({
                        Name: "Season " + moment().isoWeek(),
                        Start: moment().subtract(1, 'M'),
                        End: moment().add(1, 'M')
                    }).then(() => {
                        Tournament.create({
                            Name: "Season 17",
                            Start: moment().subtract(5, 'M'),
                            End: moment().subtract(2, 'M')
                        }).then(() => {
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
                                                Bet.create({
                                                    tournamentId: 2,
                                                    userId: 1,
                                                    Week: moment().isoWeek(),
                                                    Option: "X",
                                                    OptionNo: 2,
                                                    matchId: matchId
                                                }).then(() => {
                                                    Bet.create({
                                                        tournamentId: 2,
                                                        userId: 1,
                                                        Week: moment().isoWeek(),
                                                        Option: "X",
                                                        OptionNo: 2,
                                                        matchId: matchId
                                                    }).then(() => {
                                                        Bet.create({
                                                            tournamentId: 2,
                                                            userId: 1,
                                                            Week: moment().isoWeek(),
                                                            Option: "3",
                                                            OptionNo: 3,
                                                            matchId: matchId
                                                        }).then(() => {
                                                            done();
                                                        });
                                                    });
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

    describe("/GET Bets", () => {
        it("it should get a users bets for a specific tournament 1", done => {
            chai
                .request(server)
                .get("/user/bets/1")
                .set("authorization", "Bearer " + tokens.access_token)
                .end((err, res) => {
                    let data = JSON.parse(res.text).data;
                    /* console.log(data); */
                    data.should.be.a("array");
                    data.should.have.length(1)
                    res.should.have.status(200);
                    done();
                });
        });
        it("it should get a users bets for a specific tournament 2", done => {
            chai
                .request(server)
                .get("/user/bets/2")
                .set("authorization", "Bearer " + tokens.access_token)
                .end((err, res) => {
                    let data = JSON.parse(res.text).data;
                    /* console.log(data); */
                    data.should.be.a("array");
                    data.should.have.length(3)
                    res.should.have.status(200);
                    done();
                });
        });
    });
});