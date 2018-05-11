process.env.NODE_ENV = "test";

const config = require("config");
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server");
const should = chai.should();

const tokenController = require("../controllers/token");
const userController = require("../controllers/user");
const seq = require('../models');
const Bet = seq.bets;

const helper = require('../test/helper');

chai.use(chaiHttp);

const tokens = tokenController.generateTokens({
    Email: "Bryan@email.dk",
    Id: 1,
    IsAdmin: false
});

const tokens2 = tokenController.generateTokens({
    Email: "Ryan@email1.dk",
    Id: 2,
    IsAdmin: false
});


describe('ODDS', () => {
    beforeEach(done => {
        helper.clean(function (result) {
            const tour = helper.getTour();
            const user = helper.getUser();
            chai
                .request(server)
                .post("/tournament") //ENDPOINT[1]
                .send(tour)
                .end((err, res) => {
                    chai
                        .request(server)
                        .post("/user/signup") //ENDPOINT[2]
                        .send(user)
                        .end((err, res) => {
                            Bet.create({
                                'tournamentId': 1,
                                "userId": 1
                            }).then(() => {
                                done();
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
        it("it should send Odds", done => {
            chai
                .request(server)
                .post("/odds/1") //ENDPOINT[1]
                .set("authorization", "Bearer " + tokens.access_token)
                .send({
                    'odds': [1, 2, 3]
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    console.log(JSON.stringify(err));
                    done();
                });
        });
    });
});