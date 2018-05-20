process.env.NODE_ENV = "test";

const config = require("config");
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server");
const should = chai.should();
const moment = require("moment");

const tokenController = require("../controllers/token");

const oddsController = require("../controllers/odds");
const seq = require('../models');
const BetTable = seq.bets;
const TournamentTable = seq.tournaments;
const MatchTable = seq.matches;
const helper = require('../test/helper');

chai.use(chaiHttp);

const tokens = tokenController.generate_tokens({
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
                    TournamentTable.bulkCreate([{
                        Name: "Season " + moment().isoWeek(),
                        Start: moment().subtract(1, 'M'),
                        End: moment().add(1, 'M')
                    }, {
                        Name: "Season " + moment().isoWeek() + 1,
                        Start: moment().subtract(1, 'M'),
                        End: moment().add(1, 'M')
                    }, {
                        Name: "Season " + moment().isoWeek() + 2,
                        Start: moment().subtract(1, 'M'),
                        End: moment().add(1, 'M')
                    }]).then(() => {
                        chai.request(server)
                            .post("/user/signup") //ENDPOINT[2]
                            .send(user)
                            .end((err, res) => {
                                MatchTable.create({
                                    Id: 1,
                                    MatchId: 256,
                                    Option1: "vinder",
                                    Option2: "uafgjort",
                                    Option3: "taber",
                                    Option1Odds: 3.14,
                                    Option2Odds: 8.34,
                                    Option3Odds: 3.45
                                }).then(() => {
                                    BetTable.bulkCreate([{
                                        tournamentId: 1,
                                        userId: 1,
                                        Week: moment().isoWeek(),
                                        Option: "X",
                                        OptionNo: 2,
                                        matchId: 1
                                    }, {
                                        tournamentId: 2,
                                        userId: 1,
                                        Week: moment().isoWeek(),
                                        Option: "X",
                                        OptionNo: 2,
                                        matchId: 1
                                    }, {
                                        tournamentId: 2,
                                        userId: 1,
                                        Week: moment().isoWeek(),
                                        Option: "2",
                                        OptionNo: 3,
                                        matchId: 1
                                    }]).then(() => {
                                        done();
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
                .send([{
                        matchId: 1,
                        option: "1",
                        Week: moment().isoWeek()
                    },
                    {
                        matchId: 4,
                        option: "X",
                        Week: moment().isoWeek()
                    },
                    {
                        matchId: 9,
                        option: "2",
                        Week: moment().isoWeek()
                    },
                ])
                .end((err, res) => {
                    let msg = JSON.parse(res.text);
                    /* if (moment().weekday(3) || moment().weekday(4) || moment().weekday(5)) {
                        msg.should.eql("Turneringen er inaktiv");
                    } */
                    res.should.have.status(409);
                    done();
                });
        });
        it("it should send Odds and fail on having bets already", done => {
            chai
                .request(server)
                .post("/odds/2")
                .set("authorization", "Bearer " + tokens.access_token)
                .send([{
                        matchId: 1,
                        option: "1",
                        Week: moment().isoWeek()
                    },
                    {
                        matchId: 4,
                        option: "X",
                        Week: moment().isoWeek()
                    },
                    {
                        matchId: 9,
                        option: "2",
                        Week: moment().isoWeek()
                    },
                ])
                .end((err, res) => {
                    let msg = JSON.parse(res.text).msg;
                    // msg contains a dynamic 'x/3' bets message, so using a substring for equality check.
                    /* msg.substring(0, msg.length - 4).should.eql("Mængden af odds for denne turnering er overskredet"); */
                    res.should.have.status(409);
                    done();
                });
        });

        it("it should send Odds and save them", done => {
            chai
                .request(server)
                .post("/odds/3")
                .set("authorization", "Bearer " + tokens.access_token)
                .send([{
                        matchId: 1,
                        option: "1",
                        Week: moment().isoWeek()
                    },
                    {
                        matchId: 4,
                        option: "X",
                        Week: moment().isoWeek()
                    },
                    {
                        matchId: 9,
                        option: "2",
                        Week: moment().isoWeek()
                    },
                ])
                .end((err, res) => {
                    if (moment().weekday(3) == moment().weekday() || moment().weekday(4) == moment().weekday() || moment().weekday(5) == moment().weekday()) {
                        res.should.have.status(200);
                    } else {
                        res.should.have.status(409);
                    }
                    done();
                });
        });
    });
    describe("/GET Bets", () => {
        it("it get the most 3 recent bets", done => {
            chai
                .request(server)
                .get("/odds/recent")
                .end((err, res) => {
                    const data = JSON.parse(res.text).data;
                    res.should.have.status(200);
                    data.should.be.a('array');
                    data.length.should.be.eql(1);
                    data[0].matches.length.should.be.eql(3);
                    done();
                })

        });

        it("it get the most recent bets", done => {
            oddsController.get_recent_bets(null, (results) => {
                results.should.be.a('array');
                results.length.should.be.eql(1);
                results[0].matches.length.should.be.eql(3);
                done();
            })

        });
    });
});