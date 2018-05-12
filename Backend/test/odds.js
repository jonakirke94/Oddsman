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

const helper = require('../test/helper');

chai.use(chaiHttp);

const tokens = tokenController.generateTokens({
    Email: "Bryan@email.dk",
    Id: 1,
    IsAdmin: false
});

//seq.sequelize.sync();

describe('ODDS', () => {
    beforeEach(done => {
        helper.clean(function (result) {
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
                            Name: "Season " + moment().isoWeek() + 1,
                            Start: moment().subtract(1, 'M'),
                            End: moment().add(1, 'M')
                        }).then(() => {
                            chai.request(server)
                                .post("/user/signup") //ENDPOINT[2]
                                .send(user)
                                .end((err, res) => {
                                    Bet.create({
                                        tournamentId: 1,
                                        userId: 1,
                                        Week: moment().isoWeek()
                                    }).then(() => {
                                        Bet.create({
                                            tournamentId: 2,
                                            userId: 1,
                                            Week: moment().isoWeek(),
                                        }).then(() => {
                                            done();
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

    describe("/POST Odds", () => {
        it("it should send Odds and fail on inactive tournament", done => {
            chai
                .request(server)
                .post("/odds/1") 
                .set("authorization", "Bearer " + tokens.access_token)
                .send({
                    'odds': [{
                            matchId: 1,
                            option: "1"
                        },
                        {
                            matchId: 4,
                            option: "X"
                        },
                        {
                            matchId: 9,
                            option: "2"
                        },
                    ]
                })
                .end((err, res) => {
                    JSON.parse(res.text).msg.should.eql("Turneringen er inaktiv");
                    res.should.have.status(409);
                    done();
                });
        });
        it("it should send Odds and fail on having bets already", done => {
            chai
                .request(server)
                .post("/odds/2") 
                .set("authorization", "Bearer " + tokens.access_token)
                .send({
                    'odds': [{
                            matchId: 1,
                            option: "1"
                        },
                        {
                            matchId: 4,
                            option: "X"
                        },
                        {
                            matchId: 9,
                            option: "2"
                        },
                    ]
                })
                .end((err, res) => {
                    let msg = JSON.parse(res.text).msg;
                    // msg contains a dynamic 'x/3' bets message, so using a substring for equality check.
                    msg.substring(0, msg.length - 4).should.eql("Mængden af odds for denne turnering er overskredet");
                    res.should.have.status(409);
                    done();
                });
        });

        it("it should send Odds and save them", done => {
            chai
                .request(server)
                .post("/odds/3") 
                .set("authorization", "Bearer " + tokens.access_token)
                .send({
                    'odds': [{
                            matchId: 1,
                            option: "1"
                        },
                        {
                            matchId: 4,
                            option: "X"
                        },
                        {
                            matchId: 9,
                            option: "2"
                        },
                    ]
                })
                .end((err, res) => {
                   /*  let msg = JSON.parse(res.text).msg;
                    console.log(msg); */
                    res.should.have.status(200);
                    done();
                });
        });
    });
});