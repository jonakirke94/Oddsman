process.env.NODE_ENV = "test";

const config = require("config");
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server");
const should = chai.should();
const db = require("../db/db");

const token = require("../controllers/token");

chai.use(chaiHttp);

//Our parent block
describe("Tournaments", () => {
  beforeEach(done => {
    //Before each test we empty the database
    db.executeSql("TRUNCATE TABLE Tournaments", function(err, data) {
      done();
    });
  });
  //Test post tournament
  describe("/Create tournament", () => {
    it("it should create a tournament", done => {
      let tourney = {
        name: "Season1",
        start: new Date("2015-03-25T12:00:00Z"),
        end: new Date("2015-03-25T12:00:00Z")
      };
      chai
        .request(server)
        .post("/tournament")
        .send(tourney)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.msg.should.be.eql("Success");
          done();
        });
    });
    it("it should only create on unique name", done => {
      let tourney = {
        name: "Season1",
        start: new Date("2015-03-25T12:00:00Z"),
        end: new Date("2015-03-25T12:00:00Z")
      };
      chai
        .request(server)
        .post("/tournament")
        .send(tourney)
        .end((err, res) => {
          chai
            .request(server)
            .post("/tournament")
            .send(tourney)
            .end((err, res) => {
              res.should.have.status(409);
              res.body.msg.should.be.eql("Tournament name exists");
              done();
            });
        });
    });
  });
});
