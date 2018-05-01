process.env.NODE_ENV = "test";

const config = require("config");
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server");
const should = chai.should();
const db = require("../db/db");
const tokenController = require('../controllers/token')

const token = require("../controllers/token");

chai.use(chaiHttp);

//Our parent block
describe("Tournaments", () => {
  beforeEach(done => {
    db.cleanDatabase(function(data) {
      done();
    })
  });
  after(function(done){
      db.cleanDatabase(function(data) {
      done();
    }) 
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
    //ENROLLED TOURNAMENTS FOR USER
    describe("/Should get enrolled tournaments", () => {
      let user = {
        name: "Kobe Bryan",
        tag: "KB",
        email: "Bryan@email.dk",
        password: "123456789"
      };
      beforeEach(done => {
        
        chai
          .request(server)
          .post("/user/signup")
          .send(user)
          .end((err, res) => {
            done();
          });
      });
      it("it should get the enrolled tournament", done => {
        const tokens = tokenController.generateTokens({Email: 'Bryan@email.dk', UserId: 1, IsAdmin: false});
        chai
          .request(server)
          .post("/tournament/1/requests")
          .set('authorization', 'Bearer ' + tokens.access_token)
          .end((err, res) => {
            res.should.have.status(200);
            done();
          }); 
      });

    }) 
    
  })
 
});
