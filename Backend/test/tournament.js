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
const truncate = require('../test/truncate');

chai.use(chaiHttp); 


const tokens = tokenController.generateTokens({
  Email: "Bryan@email.dk",
  UserId: 1,
  IsAdmin: false
});

const user = {
  name: "Kobe Bryan",
  tag: "KB",
  email: "Bryan@email.dk",
  password: "123456789",
};

const tourney = {
  name: "Season1",
  start: new Date("2021-03-25T12:00:00Z"),
  end: new Date("2021-03-25T12:00:00Z")
};

/* beforeEach(done => {
  truncate.clear(function(result) {
    done();
  })
});
afterEach(function(done) {
  truncate.clear(function(result) {
    done();
  })
});

describe("/POST tournament", () => {
    it("it should create a tournament", done => {
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
    it("it should not create with a start date earlier than today", done => {
      const invTour = {
        name: "Season1",
        start: new Date("2015-03-25T12:00:00Z"),
        end: new Date("2015-03-25T12:00:00Z")
      };
      chai
        .request(server)
        .post("/tournament")
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
        .post("/tournament")
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
        .send(tourney)
        .end((err, res) => {
          chai
            .request(server)
            .post("/tournament")
            .send(tourney)
            .end((err, res) => {
              res.should.have.status(400);
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
        .post("/tournament")
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
    beforeEach(done => {
        chai
          .request(server)
          .post("/tournament")
          .send(tourney)
          .end((err, res) => {
              chai
              .request(server)
              .post("/user/signup")
              .send(user)
              .end((err, res) => {
                  done();
              });
          });    
    });

    it("it should get all tournaments", done => {
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
    it("it should get the enrolled tournament", done => {
      chai
        .request(server)
        .post(`/tournament/1/requests`)
        .set("authorization", "Bearer " + tokens.access_token)
        .end((err, res) => {
          res.should.have.status(200);
          chai
            .request(server)
            .post(`/tournament/1/requests/1`)
            .send({status: 'accepted'})
            .end((err, res) => {
              res.should.have.status(200);
              chai
                .request(server)
                .get("/tournament/enrolled")
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
    it("it should NOT get the enrolled tournament with no token", done => {
      chai
        .request(server)
        .get("/tournament/enrolled")
        .set("authorization", "Bearer ")
        .end((err, res) => {
          res.body.err.should.eql('No token provided')
          res.should.have.status(400);
          done();
        });
    });    
})  */


/* ABOVE WORKS */
       
   
/* }) 
    
    
    //ENROLLED TOURNAMENTS FOR USER
/*       describe("/Should get enrolled tournaments", () => {
      const user = {
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
        chai
          .request(server)
          .post("/tournament/1/requests")
          .set("authorization", "Bearer " + tokens.access_token)
          .end((err, res) => {
            res.should.have.status(200);
            chai
              .request(server)
              .post("/tournament/1/requests/1")
              .send({status: 'accepted'})
              .end((err, res) => {
                res.should.have.status(200);
                chai
                  .request(server)
                  .get("/tournament/enrolled")
                  .set("authorization", "Bearer " + tokens.access_token)
                  .end((err, res) => {
                    res.body.data.should.be.a("array");
                    res.body.data.should.have.length(1);
                    res.should.have.status(200);
                    done();
                  });
              });
          });
      });  */
    /*   it("it should NOT get the enrolled tournament with no token", done => {
        chai
          .request(server)
          .get("/tournament/enrolled")
          .set("authorization", "Bearer ")
          .end((err, res) => {
            res.should.have.status(500);
            done();
          });
      }); */
  

  //Test post tournament


    
 
/* 

describe("Requests", () => {
  const tokens = tokenController.generateTokens({
    Email: "Bryan@email.dk",
    UserId: 1,
    IsAdmin: false
  });
  beforeEach(done => {
    const user = {
      name: "Kobe Bryan",
      tag: "KB",
      email: "Bryan@email.dk",
      password: "123456789"
    };
    const tourney = {
      name: "Season1",
      start: new Date("2021-03-25T12:00:00Z"),
      end: new Date("2021-03-25T12:00:00Z")
    };
    db.cleanDatabase(function(data) {  
      chai
        .request(server)
        .post("/user/signup")
        .send(user)
        .end((err, res) => {     
          chai
            .request(server)
            .post("/tournament")
            .send(tourney)
            .end((err, res) => {
              done();
            });
        });
    });
  });
  after(function(done) {
    db.cleanDatabase(function(data) {
      done();
    });
  });

  describe("/POST request", () => {
    it("it should POST a request to the tournament", done => {
      chai
        .request(server)
        .post("/tournament/1/requests")
        .set("authorization", "Bearer " + tokens.access_token)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
    it("it should not POST a request to a non-existing tournament", done => {
      chai
        .request(server)
        .post("/tournament/2/requests")
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
        .post("/tournament/1/requests")
        .set("authorization", "Bearer " + xtokens.access_token)
        .end((err, res) => {
          res.should.have.status(500);
          done();
        });
    });
    it("it should not POST duplicate requests", done => {
      chai
        .request(server)
        .post("/tournament/1/requests")
        .set("authorization", "Bearer " + tokens.access_token)
        .end((err, res) => {
          res.should.have.status(200);
          chai
            .request(server)
            .post("/tournament/1/requests")
            .set("authorization", "Bearer " + tokens.access_token)
            .end((err, res) => {
              res.body.msg.should.be.eql("User already has a request");
              res.should.have.status(409);
              done();
            });
        });
    });
    it("it should not POST requests if user is already enrolled", done => {
      db.executeSql(`INSERT INTO Tournament_Users (User_Id,Tournament_Id)
      VALUES (1,1)`, function(data, err){ //request
        chai
          .request(server)
          .post("/tournament/1/requests") //attempt to request
          .set("authorization", "Bearer " + tokens.access_token)
          .end((err, res) => {
            res.body.msg.should.be.eql("User is already enrolled");
            res.should.have.status(409);      
            done();         
          })
      });
    })
  });
 */
  describe("/POST handle request request", () => {
    beforeEach(done => {
      chai
        .request(server)
        .post("/tournament")
        .send(tourney)
        .end((err, res) => {
            chai
            .request(server)
            .post("/user/signup")
            .send(user)
            .end((err, res) => {
                done();
            });
        });    
    });
    it("it should accept a request", done => {
        chai
          .request(server)
          .post("/tournament/1/requests/1") //handle request
          .send({status: 'accepted'})
          .end((err, res) => {
            res.should.have.status(200);      
            done();         
          })
    })
    it("it should decline a request", done => {
      chai
        .request(server)
        .post("/tournament/1/requests/1") //handle request
        .send({status: 'declined'})
        .end((err, res) => {
          res.should.have.status(200);      
          done();         
        })
    })  
    it("it should NOT accept a request if already enrolled", done => {
        chai
        .request(server)
        .post("/tournament/1/requests/1") //accept request
        .send({status: 'accepted'})
        .end((err, res) => {
          res.should.have.status(200);   
          chai
            .request(server)
            .post("/tournament/1/requests/1") //accept request
            .send({status: 'accepted'})
            .end((err, res) => {
              res.body.msg.should.be.eql("User is already enrolled");
              res.should.have.status(409);      
              done();         
            })    
        })
    })
    it("it should NOT accept a request to an invalid tournament", done => {
      chai
          .request(server)
          .post("/tournament/10/requests/1") //accept request
          .send({status: 'accepted'})
          .end((err, res) => {
            res.body.msg.should.be.eql("Tournament already started or doesnt exist");
            res.should.have.status(409); 
            done();         
          })
    })
    
    it("it should NOT accept a request from an invalid user", done => {
      chai
          .request(server)
          .post("/tournament/1/requests/10") //accept request
          .send({status: 'accepted'})
          .end((err, res) => {
            res.should.have.status(500);      
            done();         
          })
    })
      
    it("it should NOT accept a request to a started tournament", done => {
      const tourney = { name: "Season1", start: new Date("2014-03-25T12:00:00Z"), end: new Date("2014-03-25T12:00:00Z") };
      chai
        .request(server)
        .post("/tournament")
        .send(tourney)
        .end((err, res) => {
          chai
            .request(server)
            .post("/tournament/2/requests/1")
            .send({status: 'accepted'})
            .end((err, res) => {
              res.body.msg.should.be.eql("Tournament already started or doesnt exist");
              res.should.have.status(409);
              done();
            });
        }); 
    });
    
    it("it should NOT post a request to a started tournament", done => {
      const tourney = { name: "Season1", start: new Date("2014-03-25T12:00:00Z"), end: new Date("2014-03-25T12:00:00Z") };
      chai
        .request(server)
        .post("/tournament")
        .send(tourney)
        .end((err, res) => {
          chai
            .request(server)
            .post("/tournament/2/requests/")
            .set("authorization", "Bearer " + tokens.access_token)
            .end((err, res) => {
              res.body.msg.should.be.eql("Tournament already started or doesnt exist");
              res.should.have.status(409);
              done();
            });
        });
    }); 
  })



