 process.env.NODE_ENV = "test";

 const config = require("config");
 const chai = require("chai");
 const chaiHttp = require("chai-http");
 const server = require("../server");
 const should = chai.should();
 const db = require('../models');
 const Tournament = db.tournaments;
 const tokenController = require('../controllers/token')
 const helper = require('../test/helper');

 chai.use(chaiHttp);

 const tokens = tokenController.generateTokens({
   Email: "Bryan@email.dk",
   UserId: 1,
   IsAdmin: false
 });



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

 beforeEach(done => {
  helper.clean(function (result) {
    chai
    .request(server)
    .post("/tournament") //ENDPOINT[1]
    .send(helper.getTour({}))
    .end((err, res) => {
      chai
        .request(server)
        .post("/user/signup") //ENDPOINT[2]
        .send(helper.getUser({}))
        .end((err, res) => {
          done();
        });
    });
   })
 });
 afterEach(function (done) {
   helper.clean(function (result) {
     done();
   })
 });

/* describe("/POST tournament", () => {
  it("it should create a tournament", done => {
    chai
      .request(server)
      .post("/tournament") //ENDPOINT[1]
      .send(helper.getTour({name: 'Season 28'}))
      .end((err, res) => {
        res.should.have.status(200);
        res.body.msg.should.be.eql("Success");
        done();
      });
  });
  it("it should not create with a start date earlier than today", done => {
    const invTour = {
      name: "Season1",
      start: new Date("2015-03-25T12:00:00Z"),
      end: new Date("2015-03-25T12:00:00Z")
    };
    chai
      .request(server)
      .post("/tournament") //ENDPOINT[1]
      .send(invTour)
      .end((err, res) => {
        res.should.have.status(400);
        should.exist(res.body.err);
        res.body.err.should.be.a("array");
        done();
      });
  });
  it("it should not create with an end date earlier than start", done => {
    const invTour = {
      name: "Season1",
      start: new Date("2021-03-25T12:00:00Z"),
      end: new Date("2020-03-25T12:00:00Z")
    };
    chai
      .request(server)
      .post("/tournament") //ENDPOINT[1]
      .send(invTour)
      .end((err, res) => {
        res.should.have.status(400);
        should.exist(res.body.err);
        res.body.err.should.be.a("array");
        done();
      });
  });
  it("it should only create on unique name", done => {
    chai
      .request(server)
      .post("/tournament")
      .send(helper.getTour({}))
      .end((err, res) => {
        chai
          .request(server)
          .post("/tournament") //ENDPOINT[1]
          .send(helper.getTour({}))
          .end((err, res) => {
            res.should.have.status(409);
            res.body.err.should.be.eql("Name must be unique");
            done();
          });
      });
  });
  it("it not create with missing arguments", done => {
    const invTour = {
      start: new Date("2021-03-25T12:00:00Z"),
      end: new Date("2021-03-25T12:00:00Z")
    };
    chai
      .request(server)
      .post("/tournament") //ENDPOINT[1]
      .send(invTour)
      .end((err, res) => {
        res.should.have.status(400);
        should.exist(res.body.err);
        res.body.err.should.be.a("array");
        done();
      });
  });
});

describe("/GET tournaments", () => {
  it("it should get all tournaments", done => {
    chai
      .request(server)
      .get("/tournament") //ENDPOINT[5]
      .end((err, res) => {
        res.should.have.status(200);
        res.body.data.should.be.a("array");
        res.body.data.should.have.length(1);
        res.body.data[0].should.be.a("object");
        done();
      });
  });
  it("it should get all delisted tournaments", done => {
    chai
      .request(server)
      .post("/tournament") //ENDPOINT[1]
      .send(helper.getTour({name: 'Season 2'}))
      .end((err, res) => {
        chai
          .request(server)
          .post(`/tournament/1/requests`) //ENDPOINT[3]
          .set("authorization", "Bearer " + tokens.access_token)
          .end((err, res) => {
            res.should.have.status(200);
            chai
              .request(server)
              .post(`/tournament/1/requests/1`) //ENDPOINT[4]
              .send({
                status: "accepted"
              })
              .end((err, res) => {
                res.should.have.status(200);
                chai
                  .request(server)
                  .get("/tournament/delisted") //ENDPOINT[7]
                  .set("authorization", "Bearer " + tokens.access_token)
                  .end((err, res) => {
                    res.should.have.status(200);
                    res.body.data.should.be.a("array");
                    res.body.data.should.have.length(1);
                    res.body.data[0].should.be.a("object");
                    done();
                  });
              });
          });
      });
  });
  it("it should get the enlisted tournament", done => {
    chai
      .request(server)
      .post(`/tournament/1/requests`) //ENDPOINT[3]
      .set("authorization", "Bearer " + tokens.access_token)
      .end((err, res) => {
        res.should.have.status(200);
        chai
          .request(server)
          .post(`/tournament/1/requests/1`) //ENDPOINT[4]
          .send({
            status: "accepted"
          })
          .end((err, res) => {
            res.should.have.status(200);
            chai
              .request(server)
              .get("/tournament/enlisted") //ENDPOINT[6]
              .set("authorization", "Bearer " + tokens.access_token)
              .end((err, res) => {
                res.body.data.should.be.a("array");
                res.body.data.should.have.length(1);
                res.should.have.status(200);
                done();
              });
          });
      });
  });
  it("it should NOT get the enlisted tournament with no token", done => {
    chai
      .request(server)
      .get("/tournament/enlisted") //ENDPOINT[6]
      .set("authorization", "Bearer ")
      .end((err, res) => {
        res.body.err.should.eql("No token provided");
        res.should.have.status(400);
        done();
      });
  });
}); 

describe("/POST manage request", () => {
  it("it should accept a request", done => {
    chai
      .request(server)
      .post("/tournament/1/requests/1") //ENDPOINT[4]
      .send({
        status: "accepted"
      })
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
  it("it should decline a request", done => {
    chai
      .request(server)
      .post("/tournament/1/requests/1") //ENDPOINT[4]
      .send({
        status: "declined"
      })
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
  it("it should NOT accept a request if already enlisted", done => {
    chai
      .request(server)
      .post("/tournament/1/requests/1") //ENDPOINT[4]
      .send({
        status: "accepted"
      })
      .end((err, res) => {
        res.should.have.status(200);
        chai
          .request(server)
          .post("/tournament/1/requests/1") //ENDPOINT[4]
          .send({
            status: "accepted"
          })
          .end((err, res) => {
            res.body.msg.should.be.eql("User is already enlisted");
            res.should.have.status(409);
            done();
          });
      });
  });
  it("it should NOT accept a request to an invalid tournament", done => {
    chai
      .request(server)
      .post("/tournament/10/requests/1") //ENDPOINT[4]
      .send({
        status: "accepted"
      })
      .end((err, res) => {
        res.body.msg.should.be.eql(
          "Tournament already started or doesnt exist"
        );
        res.should.have.status(409);
        done();
      });
  });
  it("it should NOT accept a request from an invalid user", done => {
    chai
      .request(server)
      .post("/tournament/1/requests/10") //ENDPOINT[4]
      .send({
        status: "accepted"
      })
      .end((err, res) => {
        res.should.have.status(500);
        done();
      });
  });
  it("it should NOT accept a request to a started tournament", done => {

    chai
      .request(server)
      .post("/tournament") //ENDPOINT[1]
      .send(helper.getTour({start: new Date("2014-03-25T12:00:00Z")}))
      .end((err, res) => {
        chai
          .request(server)
          .post("/tournament/2/requests/1")  //ENDPOINT[4]
          .send({
            status: "accepted"
          })
          .end((err, res) => {
            res.body.msg.should.be.eql(
              "Tournament already started or doesnt exist"
            );
            res.should.have.status(409);
            done();
          });
      });
  });
  it("it should NOT post a request to a started tournament", done => {
    chai
      .request(server)
      .post("/tournament")  //ENDPOINT[1]
      .send(helper.getTour({start: new Date("2014-03-25T12:00:00Z")}))
      .end((err, res) => {
        chai
          .request(server)
          .post("/tournament/2/requests/")  //ENDPOINT[3]
          .set("authorization", "Bearer " + tokens.access_token)
          .end((err, res) => {
            res.body.msg.should.be.eql(
              "Tournament already started or doesnt exist"
            );
            res.should.have.status(409);
            done();
          });
      });
  });
}); 

describe("/POST request", () => {
  it("it should POST a request to the tournament", done => {
    chai
      .request(server)
      .post("/tournament/1/requests") //ENDPOINT[3]
      .set("authorization", "Bearer " + tokens.access_token)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
  it("it should not POST a request to a non-existing tournament", done => {
    chai
      .request(server)
      .post("/tournament/2/requests") //ENDPOINT[3]
      .set("authorization", "Bearer " + tokens.access_token)
      .end((err, res) => {        
        res.body.msg.should.be.eql("Tournament already started or doesnt exist");
        res.should.have.status(409);
        done();
      });
  });
  it("it should not POST a request with an invalid id", done => {
    const xtokens = tokenController.generateTokens({
      Email: "Bryan@email.dk",
      UserId: 100,
      IsAdmin: false
    });
    chai
      .request(server)
      .post("/tournament/1/requests") //ENDPOINT[3]
      .set("authorization", "Bearer " + xtokens.access_token)
      .end((err, res) => {
        res.should.have.status(500);
        done();
      });
  });
  it("it should not POST duplicate requests", done => {
    chai
      .request(server)
      .post("/tournament/1/requests") //ENDPOINT[3]
      .set("authorization", "Bearer " + tokens.access_token)
      .end((err, res) => {
        res.should.have.status(200);
        chai
          .request(server)
          .post("/tournament/1/requests") //ENDPOINT[3]
          .set("authorization", "Bearer " + tokens.access_token)
          .end((err, res) => {
            res.body.msg.should.be.eql("User already has a request");
            res.should.have.status(409);
            done();
          });
      });
  });
  it("it should not POST requests if user is already enlisted", done => {
    chai
      .request(server)
      .post("/tournament/1/requests/1") //ENDPOINT[4]
      .send({ status: "accepted" })
      .end((err, res) => {
        chai
          .request(server)
          .post("/tournament/1/requests") //ENDPOINT[3]
          .set("authorization", "Bearer " + tokens.access_token)
          .end((err, res) => {
            res.body.msg.should.be.eql("User is already enlisted");
            res.should.have.status(409);
            done();
          });
      });
  });
});

 */