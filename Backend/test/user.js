process.env.NODE_ENV = "test";

const config = require("config");
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server");
const should = chai.should();
const db = require("../db/db");
const assert = require('assert');


const user = require("../controllers/user");

chai.use(chaiHttp);

//Our parent block
describe("Users", () => {
  beforeEach(done => {
    //Before each test we empty the database
    db.executeSql("TRUNCATE TABLE Users", function(err, data) {
      done();
    });
  });

  //Test the /GET route
  describe("/GET Users", () => {
    it("it should GET a user by id 1", done => {
      let person = {name: "Kobe Bryan",tag: "KB", email: "Bryan@email.dk", password: "123456789"};
      chai
        .request(server)
        .post("/user")
        .send(person)
        .end((err, res) => {
          user.userById(1, function(data, err) {
            should.equal(err, undefined);
            assert.equal(data.UserId, 1);
            assert.equal(data.Name, "Kobe Bryan");
            done();
          })     
        });
        
    });
    it("it should not GET anything with a crazy id", done => {
      let person = {name: "Kobe Bryan",tag: "KB", email: "Bryan@email.dk", password: "123456789"};
      chai
        .request(server)
        .post("/user")
        .send(person)
        .end((err, res) => {
          user.userById(13249, function(data, err) {
            should.equal(data, undefined);
            done();
          })     
        });
    });
    it("it should GET a user by email correctly", done => {
      let person = {name: "Kobe Bryan",tag: "KB", email: "Bryan@email.dk", password: "123456789"};
      chai
        .request(server)
        .post("/user")
        .send(person)
        .end((err, res) => {
          user.userByEmail('Bryan@email.dk', function(data, err) {
            should.equal(err, undefined);
            assert.equal(data.UserId, 1);
            assert.equal(data.Name, "Kobe Bryan");
            done();
          })     
        });
        
    });
    it("it should not GET anything with a crazy email", done => {
      let person = {name: "Kobe Bryan",tag: "KB", email: "Bryan@email.dk", password: "123456789"};
      chai
        .request(server)
        .post("/user")
        .send(person)
        .end((err, res) => {
          user.userByEmail('asdasda@emsdail.dk', function(data, err) {
            should.equal(data, undefined);
            done();
          })     
        });
    });
  });

  //Test the /Post route
  describe("/POST Users", () => {
    it("it should POST a user ", done => {
      let person = {name: "Kobe Bryan",tag: "KB", email: "Bryan@email.dk", password: "123456789"};
      chai
        .request(server)
        .post("/user")
        .send(person)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.msg.should.be.eql("Success");
          done();
        });
    });
    it("it should only post unique emails", done => {
      let person = {name: "Kobe Bryan",tag: "KB", email: "Bryan@email.dk", password: "123456789"};
      chai
        .request(server)
        .post("/user")
        .send(person)
        .end((err, res) => {
            chai
              .request(server)
              .post("/user")
              .send(person)
              .end((err, res) => {
                res.should.have.status(409);
                res.body.msg.should.be.eql("Email exists");
                done();
              })
        });
    });
    it("it should not post invalid emails", done => {
      let person = {name: "Kobe Bryan",tag: "KB", email: "Bryanemail.dk", password: "123456789"};
      chai
        .request(server)
        .post("/user")
        .send(person)
        .end((err, res) => {
          res.should.have.status(400);
          should.exist(res.body.err);
          res.body.err.should.be.a('array');
          done();
        });
    });
    it("it should not post with a short password", done => {
      let person = {name: "Kobe Bryan",tag: "KB", email: "Bryanmail.dk", password: "1234567"};
      chai
        .request(server)
        .post("/user")
        .send(person)
        .end((err, res) => {
          res.should.have.status(400);
          should.exist(res.body.err);
          res.body.err.should.be.a('array');
          done();
        });
    });
    it("it should NOT post with missing fields", done => {
      let person = {name: "Kobe Bryan",  email: "Bryan@email.dk", password: "123456789"};
      chai
        .request(server)
        .post("/user")
        .send(person)
        .end((err, res) => {
          res.should.have.status(500);
          res.body.error.message.should.be.eql("ER_BAD_NULL_ERROR: Column 'Tag' cannot be null");     
          done();
        });
    });
  });
});
