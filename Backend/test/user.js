process.env.NODE_ENV = "test";

const config = require("config");
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server");
const should = chai.should();
const tokenController = require("../controllers/token");
const db = require("../db/db");

const user = require("../controllers/user");

chai.use(chaiHttp);

//Our parent block
describe("Users", () => {
  beforeEach(done => {
    db.cleanDatabase(function(data) {
      done();
    });
  });

  /****************************** TESTING GETBYPROPERTY *****************************/
  describe("/GET User", () => {
    beforeEach(done => {
      //Seed a user before all GETBYPROPERTY tests
      let person = {
        name: "Kobe Bryan",
        tag: "KB",
        email: "Bryan@email.dk",
        password: "123456789"
      };
      chai
        .request(server)
        .post("/user/signup")
        .send(person)
        .end((err, res) => {
          done();
        });
    });
    it("it should GET a user by id 1", done => {
      //2 since admin has been seeded
      user.getUserByProperty("UserId", 1, function(data, err) {
        should.equal(err, undefined);
        should.equal(data.UserId, 1);
        should.equal(data.Name, "Kobe Bryan");
        done();
      });
    });
    it("it should not GET anything with a crazy id", done => {
      user.getUserByProperty("UserId", 13249, function(data, err) {
        should.equal(data, undefined);
        done();
      });
    });
    it("it should GET a user by email correctly", done => {
      user.getUserByProperty("Email", "Bryan@email.dk", function(data, err) {
        should.equal(err, undefined);
        should.equal(data.UserId, 1);
        should.equal(data.Name, "Kobe Bryan");
        done();
      });
    });
    it("it should not GET anything with a crazy email", done => {
      user.getUserByProperty("Email", "asdasda@emsdail.dk", function(
        data,
        err
      ) {
        should.equal(data, undefined);
        done();
      });
    });
    it("it should not GET anything with an invalid column", done => {
      user.getUserByProperty("XXX", "asdasda@emsdail.dk", function(data, err) {
        should.equal(data, null);
        done();
      });
    });
    it("it should not GET anything with a wrong column/value pair", done => {
      user.getUserByProperty("UserId", "Bryan@email.dk", function(data, err) {
        should.equal(data, undefined);
        done();
      });
    });
  });

  /****************************** TESTING SIGNUP *****************************/
  describe("/POST User/signup", () => {
    it("it should signup a user ", done => {
      let person = {
        name: "Kobe Bryan",
        tag: "KB",
        email: "Bryan@email.dk",
        password: "123456789"
      };
      chai
        .request(server)
        .post("/user/signup")
        .send(person)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.msg.should.be.eql("Success");
          done();
        });
    });
    it("it should only signup unique emails", done => {
      let person = {
        name: "Kobe Bryan",
        tag: "KB",
        email: "Bryan@email.dk",
        password: "123456789"
      };
      chai
        .request(server)
        .post("/user/signup")
        .send(person)
        .end((err, res) => {
          chai
            .request(server)
            .post("/user/signup")
            .send(person)
            .end((err, res) => {
              res.should.have.status(409);
              done();
            });
        });
    });
    it("it should only signup unique tags", done => {
      let person = {
        name: "Kobe Bryan",
        tag: "KB",
        email: "Kobe@smail.dk",
        password: "123456789"
      };
      chai
        .request(server)
        .post("/user/signup")
        .send(person)
        .end((err, res) => {
          let person1 = {
            name: "Kobe Bryan",
            tag: "KB",
            email: "Hendrick@smail.dk",
            password: "123456789"
          };
          chai
            .request(server)
            .post("/user/signup")
            .send(person1)
            .end((err, res) => {
              res.should.have.status(409);
              done();
            });
        });
    });
    it("it should not signup invalid emails", done => {
      let person = {
        name: "Kobe Bryan",
        tag: "KB",
        email: "Bryanemail.dk",
        password: "123456789"
      };
      chai
        .request(server)
        .post("/user/signup")
        .send(person)
        .end((err, res) => {
          res.should.have.status(400);
          should.exist(res.body.err);
          res.body.err.should.be.a("array");
          done();
        });
    });
    it("it should not signup with a short password", done => {
      let person = {
        name: "Kobe Bryan",
        tag: "KB",
        email: "Bryanmail.dk",
        password: "1234567"
      };
      chai
        .request(server)
        .post("/user/signup")
        .send(person)
        .end((err, res) => {
          res.should.have.status(400);
          should.exist(res.body.err);
          res.body.err.should.be.a("array");
          done();
        });
    });
    it("it should NOT signup with missing fields", done => {
      let person = {
        name: "Kobe Bryan",
        email: "Bryan@email.dk",
        password: "123456789"
      };
      chai
        .request(server)
        .post("/user/signup")
        .send(person)
        .end((err, res) => {
          res.should.have.status(500);
          res.body.error.message.should.be.eql(
            "ER_BAD_NULL_ERROR: Column 'Tag' cannot be null"
          );
          done();
        });
    });
  });

  /****************************** TESTING LOGIN *****************************/
  describe("/POST User/login", () => {
    beforeEach(done => {
      let person = {
        name: "Kobe Bryan",
        tag: "KB",
        email: "Bryan@email1.dk",
        password: "123456789"
      };
      chai
        .request(server)
        .post("/user/signup")
        .send(person)
        .end((err, res) => {
          done();
        });
    });
    it("it should login a user ", done => {
      let login = { email: "Bryan@email1.dk", password: "123456789" };
      chai
        .request(server)
        .post("/user/login")
        .send(login)
        .end((err, res) => {
          user.getUserByProperty("UserId", 1, function(data, err) {
            res.should.have.status(200);
            done();
          });
        });
    });
    it("it should return generated tokens", done => {
      let login = { email: "Bryan@email1.dk", password: "123456789" };
      chai
        .request(server)
        .post("/user/login")
        .send(login)
        .end((err, res) => {
          user.getUserByProperty("UserId", 1, function(data, err) {
            res.should.have.status(200);
            should.exist(res.body.data.access_token);
            should.exist(res.body.data.refresh_exp);
            done();
          });
        });
    });
    it("it should save a refresh token on login", done => {
      let login = { email: "Bryan@email1.dk", password: "123456789" };
      chai
        .request(server)
        .post("/user/login")
        .send(login)
        .end((err, res) => {
          user.getUserByProperty("UserId", 1, function(data, err) {
            should.not.equal(data.RefreshToken, null);
            done();
          });
        });
    });
    it("it should return 401 on invalid password", done => {
      let login = { email: "Bryan@email1.dk", password: "123456" };
      chai
        .request(server)
        .post("/user/login")
        .send(login)
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
    it("it should return 401 on emails that don't exist", done => {
      let login = { email: "Bryan@email2.dk", password: "123456789" };
      chai
        .request(server)
        .post("/user/login")
        .send(login)
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
  });

  describe("/PATCH User/", () => {
    beforeEach(done => {
      let person = {
        name: "Kobe Bryan",
        tag: "KB",
        email: "Bryan@email1.dk",
        password: "123456789"
      };
      const tokens = tokenController.generateTokens({
        Email: "Bryan@email1.dk",
        UserId: 1,
        IsAdmin: false
      });
      chai
        .request(server)
        .post("/user/signup")
        .send(person)
        .end((err, res) => {
          done();
        });
    });

    it("it should update a user", done => {
      let values = { tag: "XXX", name: "newname" };
      chai
        .request(server)
        .patch("/user/")
        .set("authorization", "Bearer " + tokens.access_token)
        .send(values)
        .end((err, res) => {
          res.should.have.status(200);
          user.getUserByProperty("UserId", 1, function(data, err) {
            data.Name.should.be.eql("newname");
            data.Email.should.be.eql("Bryan@email1.dk");
            data.Tag.should.be.eql("XXX");
            done();
          });
        });
    });
    describe("/PATCH User/ duplicate inputs", () => {
      const xtokensx = tokenController.generateTokens({
        Email: "Ryan@email1.dk",
        UserId: 2,
        IsAdmin: false
      });
      beforeEach(done => {
        let person = {
          name: "Ryan",
          tag: "RB",
          email: "Ryan@email1.dk",
          password: "123456789"
        };
        chai
          .request(server)
          .post("/user/signup")
          .send(person)
          .end((err, res) => {
            done();
          });
      });
      it("it should not update a user with duplicate email", done => {
        let values = { email: "Bryan@email1.dk", name: "newname" };
        chai
          .request(server)
          .patch("/user/")
          .set("authorization", "Bearer " + xtokensx.access_token)
          .send(values)
          .end((err, res) => {
            res.should.have.status(409);
            res.body.err.should.be.eql("Email is already taken");
            done();
          });
      });
      it("it should not update a user with duplicate tag", done => {
        let values = { tag: "KB", name: "newname" };
        chai
          .request(server)
          .patch("/user/")
          .set("authorization", "Bearer " + xtokensx.access_token)
          .send(values)
          .end((err, res) => {
            res.should.have.status(409);
            res.body.err.should.be.eql("Tag is already taken");
            done();
          });
      });
    });
    it("it should not anything with empty inputs", done => {
      chai
        .request(server)
        .patch("/user/")
        .set("authorization", "Bearer " + tokens.access_token)
        .send({})
        .end((err, res) => {
          res.should.have.status(400);
          user.getUserByProperty("UserId", 1, function(data, err) {
            data.Name.should.be.eql("Kobe Bryan");
            data.Email.should.be.eql("Bryan@email1.dk");
            data.Tag.should.be.eql("KB");
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
});
