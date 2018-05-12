 process.env.NODE_ENV = "test";

 const config = require("config");
 const chai = require("chai");
 const chaiHttp = require("chai-http");
 const server = require("../server");
 const should = chai.should();
 const db = require('../models');
 const Tournament = db.tournaments;
 const tokenController = require('../controllers/token')
 const token = require("../controllers/token");
 const helper = require('../test/helper');
 const moment = require('moment');

 chai.use(chaiHttp);

 const tokens = tokenController.generateTokens({
   Email: "Bryan@email.dk",
   Id: 1,
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

 describe('TOURNAMENTS', () => {
   beforeEach(done => {
     helper.clean(function (result) {
       const tour = helper.getTour({});
       const user = helper.getUser({});
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



   describe("/POST tournament", () => {
     it("it should create a tournament", done => {
       const tour = helper.getTour({
         name: 'Season 28'
       })
       chai
         .request(server)
         .post("/tournament") //ENDPOINT[1]
         .send(tour)
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
       const tour = helper.getTour({})
       chai
         .request(server)
         .post("/tournament") //ENDPOINT[1]
         .send(tour)
         .end((err, res) => {
           res.should.have.status(409);
           res.body.err.should.be.eql("Name must be unique");
           done();
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
       const tour = helper.getTour({
         name: 'Season 2'
       })
       chai
         .request(server)
         .post("/tournament") //ENDPOINT[1]
         .send(tour)
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
     it("It should get the current tournament", done => {
       const user = helper.getUser();
       chai.request(server)
         .post("/user/signup") //ENDPOINT[2]
         .send(user)
         .end((err, res) => {
           Tournament.create({
             Name: "Active",
             Start: moment().subtract(1, 'M'),
             End: moment().add(1, 'M')
           }).then(() => {
             Tournament.create({
               Name: "Not Active",
               Start: moment().add(2, 'M'),
               End: moment().add(4, 'M')
             }).then(() => {
               chai
                 .request(server)
                 .get("/tournament/current") //ENDPOINT[6]
                 .set("authorization", "Bearer ")
                 .end((err, res) => {
                   const data = JSON.parse(res.text).data;
                   res.should.have.status(200);
                   data.name.should.be.eql("Active");
                   done();
                 });
             });
           });
         });
     });
     it("It should try to get the current tournament but wont find any", done => {
       const user = helper.getUser();
       chai.request(server)
         .post("/user/signup") //ENDPOINT[2]
         .send(user)
         .end((err, res) => {
           Tournament.create({
             Name: "Not Active",
             Start: moment().add(2, 'M'),
             End: moment().add(4, 'M')
           }).then(() => {
             chai
               .request(server)
               .get("/tournament/current") //ENDPOINT[6]
               .set("authorization", "Bearer ")
               .end((err, res) => {
                 res.should.have.status(404);
                 done();
               });
           });
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
           res.should.have.status(400);
           done();
         });
     });
     it("it should NOT accept a request to a started tournament", done => {
       const tour = helper.getTour({
         start: new Date("2014-03-25T12:00:00Z")
       });
       chai
         .request(server)
         .post("/tournament") //ENDPOINT[1]
         .send(tour)
         .end((err, res) => {
           chai
             .request(server)
             .post("/tournament/2/requests/1") //ENDPOINT[4]
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
       const tour = helper.getTour({
         start: new Date("2014-03-25T12:00:00Z")
       })
       chai
         .request(server)
         .post("/tournament") //ENDPOINT[1]
         .send(tour)
         .end((err, res) => {
           chai
             .request(server)
             .post("/tournament/2/requests/") //ENDPOINT[3]
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

   describe("/GET requests", () => {
     it("It should get requests for the tournament", done => {
       chai
         .request(server)
         .post("/tournament/1/requests/") //ENDPOINT[3]
         .set("authorization", "Bearer " + tokens.access_token)
         .end((err, res) => {
           chai
             .request(server)
             .get("/tournament/requests/1")
             .set("authorization", "Bearer" + tokens.access_token)
             .end((err, res) => {
               res.should.have.status(200);
               res.body.data.users.should.be.a("array");
               done();
             });
         });
     });
     it("It should get requests for the user", done => {
       chai
         .request(server)
         .post("/tournament/1/requests/") //ENDPOINT[3]
         .set("authorization", "Bearer " + tokens.access_token)
         .end((err, res) => {
           chai
             .request(server)
             .get("/tournament/requests")
             .set("authorization", "Bearer " + tokens.access_token)
             .end((err, res) => {
               res.should.have.status(200);
               res.body.data.should.be.a("array");
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
         Id: 100,
         IsAdmin: false
       });
       chai
         .request(server)
         .post("/tournament/1/requests") //ENDPOINT[3]
         .set("authorization", "Bearer " + xtokens.access_token)
         .end((err, res) => {
           res.should.have.status(400);
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
         .send({
           status: "accepted"
         })
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

 })