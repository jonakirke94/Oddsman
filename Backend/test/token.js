/* process.env.NODE_ENV = "test";

const config = require("config");
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server");
const should = chai.should();
const db = require("../db/db");

const user = require("../controllers/user");

chai.use(chaiHttp);

//Our parent block
describe("Users", () => {
  beforeEach(done => {
    //Before each test we empty the database
    db.executeSql("TRUNCATE TABLE Persons", function(err, data) {
      done();
    });
  });

  //Test the /GET route
  describe("/GET Users", () => {
    it("it should GET all the users", done => {
      chai
        .request(server)
        .get("/user/all")
        .end((err, res) => {
          res.should.have.status(200);
          should.exist(res.body.data);
          res.body.data.should.be.a("array");
          res.body.data.length.should.be.eql(0);
          done();
        });
    });
  });
  //Test the /Post route
  describe("/POST Users", () => {
    it("it should POST a user ", done => {
      let person = {
        name: "Kobe",
        lastname: "Bryan"
      };
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
  });
});
 */