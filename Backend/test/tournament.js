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
  describe("/POST tournament", () => {
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
    it("it not create with missing arguments", done => {
      let tourney = {
        start: new Date("2015-03-25T12:00:00Z"),
        end: new Date("2015-03-25T12:00:00Z")
      };
      chai
        .request(server)
        .post("/tournament")
        .send(tourney)
        .end((err, res) => {
          res.should.have.status(400);
          should.exist(res.body.err);
          res.body.err.should.be.a("array");
          done();
        });
    });
  });
   describe("/GET tournament", () => {
      beforeEach(done => {
      //Seed database 
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
          done();
        })
    }); 

     it("it should fetch all tournaments", done => {
      chai
        .request(server)
        .get("/tournament")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.data.should.be.a("array");
          res.body.data.should.have.length(1);
          res.body.data[0].should.be.a("object");
          done();
        });
    });
  })
 


  
});
