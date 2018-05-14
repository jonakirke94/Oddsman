process.env.NODE_ENV = "test";

const config = require("config");
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server");
const should = chai.should();

const tokenController = require("../controllers/token");
const userController = require("../controllers/user");

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

/************************************************
 * ENDPOINT EXPLANATION
 * 1: CREATE A USER
 * 2: LOG A USER IN
 * 3: UPDATE A USER
 * 4: GET ALL USERS
 ************************************************/

describe("/Users", () => {
  beforeEach(done => {
    const user = helper.getUser({})
    helper.clean(function (result) {
      chai
        .request(server)
        .post("/user/signup") //ENDPOINT[1]
        .send(user)
        .end((err, res) => {
          done();
        });
    })
  });
  afterEach(function (done) {
    helper.clean(function (result) {
      done();
    })
  });

  describe("/GET Users", () => {
    it("it should get a user with id 1", () => {
      return userController.getById(1, function (user) {
        should.equal(user.Id, 1);
        should.equal(user.Name, "Kobe Bryan");
      })
    })
    it("it should not GET anything with a crazy id", () => {
      return userController.getById(12314).then(user => {
        should.equal(user, null);
      })
    })
    it("it should GET a user by email correctly", () => {
      return userController.getByEmail('Bryan@email.dk').then(user => {
        should.equal(user.Id, 1);
        should.equal(user.Name, "Kobe Bryan");
      })
    });
    it("it should not GET anything with a crazy email", () => {
      return userController.getByEmail('asdasda@email.dk').then(user => {
        should.equal(user, null);
      })
    });
    it("it should GET all users", done => {
      const user = helper.getUser({
        tag: 'RS',
        email: 'new@email.dk'
      })
      chai
        .request(server)
        .post("/user/signup") //ENDPOINT[1]
        .send(user)
        .end((err, res) => {
          chai
            .request(server)
            .get("/user/") //ENDPOINT[4]
            .end((err, res) => {
              res.should.have.status(200);
              res.body.data.should.be.a("array");
              res.body.data.should.have.length(2);
              done();
            });
        });

    });
  })

  describe("/POST Users/Signup", () => {
    it("it should signup a user ", done => {
      const user = helper.getUser({
        tag: 'RS',
        email: 'new@email.dk'
      })
      chai
        .request(server)
        .post("/user/signup") //ENDPOINT[1]
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.msg.should.be.eql("Success");
          done();
        });
    });

    it("it should only signup unique emails", done => {
      const user = helper.getUser({
        name: 'FancyName',
        tag: 'FF'
      })
      chai
        .request(server)
        .post("/user/signup") //ENDPOINT[1]
        .send(user)
        .end((err, res) => {
          res.should.have.status(409);
          done();
        });
    });

    it("it should only signup unique tags", done => {
      const user = helper.getUser({
        name: 'FancyName',
        email: 'fancy@email.dk'
      })
      chai
        .request(server)
        .post("/user/signup") //ENDPOINT[1]
        .send(user)
        .end((err, res) => {
          res.should.have.status(409);
          done();
        });
    });

    it("it should not signup invalid emails", done => {
      const user = helper.getUser({
        email: 'Bryanemail.dk'
      })
      chai
        .request(server)
        .post("/user/signup") //ENDPOINT[1]
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          should.exist(res.body.err);
          res.body.err.should.be.a("array");
          done();
        });
    });


    it("it should not signup with a short password", done => {
      const user = helper.getUser({
        password: '123456'
      })
      chai
        .request(server)
        .post("/user/signup") //ENDPOINT[1]
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          should.exist(res.body.err);
          res.body.err.should.be.a("array");
          done();
        });
    });

    it("it should NOT signup with missing fields", done => {
      let missingFields = {
        name: "Kobe Bryan",
        email: "Bryan@email.dk",
        password: "123456789"
      };
      chai
        .request(server)
        .post("/user/signup") //ENDPOINT[1]
        .send(missingFields)
        .end((err, res) => {
          res.should.have.status(409);
          res.body.err.should.be.eql(
            "users.Tag cannot be null"
          );
          done();
        });
    });

  })

  describe("/POST Users/Login", () => {
    let login = {
      email: "Bryan@email.dk",
      password: "123456789"
    };
    it("it should login a user ", done => {
      chai
        .request(server)
        .post("/user/login") //ENDPOINT[2]
        .send(login)
        .end((err, res) => {
          userController.getById(1).then(user => {
            res.should.have.status(200);
            done();
          })
        });
    });

    it("it should return generated tokens", done => {
      chai
        .request(server)
        .post("/user/login") //ENDPOINT[2]
        .send(login)
        .end((err, res) => {
          userController.getById(1).then(user => {
            res.should.have.status(200);
            should.exist(res.body.data.access_token);
            should.exist(res.body.data.refresh_exp);
            done();
          })
        });
    });

    it("it should save a refresh token on login", done => {
      chai
        .request(server)
        .post("/user/login") //ENDPOINT[2]
        .send(login)
        .end((err, res) => {
          userController.getById(1).then(user => {
            should.exist(user.RefreshToken);
            done();
          });
        });
    });

    it("it should return 401 on invalid password", done => {
      let invalidLogin = {
        email: "Bryan@email1.dk",
        password: "123456"
      };
      chai
        .request(server)
        .post("/user/login") //ENDPOINT[2]
        .send(invalidLogin)
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });

    it("it should return 401 on emails that don't exist", done => {
      let invalidLogin = {
        email: "Bryan@email2.dk",
        password: "123456789"
      };
      chai
        .request(server)
        .post("/user/login") //ENDPOINT[2]
        .send(invalidLogin)
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });

  })

  describe("/PATCH Users", () => {
    const user2 = helper.getUser({
      name: 'Ryan',
      tag: 'RB',
      email: 'Ryan@email1.dk'
    })
    beforeEach(done => {
      chai
        .request(server)
        .post("/user/signup") //ENDPOINT[1]
        .send(user2)
        .end((err, res) => {
          done();
        });
    });

    it("it should update a user", done => {
      let values = {
        tag: "XXX",
        name: "newname"
      };
      chai
        .request(server)
        .patch("/user/") //ENDPOINT[3]
        .set("authorization", "Bearer " + tokens.access_token)
        .send(values)
        .end((err, res) => {
          res.should.have.status(200);
          userController.getById(1).then(user => {
            user.Name.should.be.eql("newname");
            user.Email.should.be.eql("Bryan@email.dk");
            user.Tag.should.be.eql("XXX");
            done();
          })
        });
    });
    it("it should not update a user with a non-unique email", done => {
      let values = {
        email: "Bryan@email.dk",
        name: "newname"
      };
      chai
        .request(server)
        .patch("/user/") //ENDPOINT[3]
        .set("authorization", "Bearer " + tokens2.access_token)
        .send(values)
        .end((err, res) => {
          res.should.have.status(409);
          res.body.err.should.be.eql("Email must be unique");
          done();
        });
    });

    it("it should not update a user with duplicate tag", done => {
      let values = {
        tag: "KB",
        name: "newname"
      };
      chai
        .request(server)
        .patch("/user/") //ENDPOINT[3]
        .set("authorization", "Bearer " + tokens2.access_token)
        .send(values)
        .end((err, res) => {
          res.should.have.status(409);
          res.body.err.should.be.eql("Tag must be unique");
          done();
        });
    });

    it("it should not anything with empty inputs", done => {
      chai
        .request(server)
        .patch("/user/") //ENDPOINT[3]
        .set("authorization", "Bearer " + tokens.access_token)
        .send({})
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });

  })
})