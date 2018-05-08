 process.env.NODE_ENV = "test";

const config = require("config");
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server");
const should = chai.should();
const db = require("../db/db");

const token = require("../controllers/token");

chai.use(chaiHttp);


describe("/Generate tokens", () => {
  it("it should return tokens and expirations", done => {
    const user = {Email: "Test@Test.dk", UserId: 1}
    const tokens = token.generateTokens(user);
    should.not.equal(tokens.access_token, undefined);
    should.not.equal(tokens.refresh_token, undefined);
    should.not.equal(tokens.access_exp, undefined);
    should.not.equal(tokens.refresh_exp, undefined);
    done();
  });
});


 