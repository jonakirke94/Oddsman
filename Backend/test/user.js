 process.env.NODE_ENV = "test";

const config = require("config");
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server");
const should = chai.should();
const tokenController = require("../controllers/token");

const userController = require("../controllers/user");

const truncate = require('../test/truncate');
chai.use(chaiHttp);

const user = {
  name: "Kobe Bryan",
  tag: "KB",
  email: "Bryan@email.dk",
  password: "123456789"
};


beforeEach(done => {
  truncate.clear(function(result) {   
          chai
          .request(server)
          .post("/user/signup")
          .send(user)
          .end((err, res) => {
              done();
          });    
  })
});
afterEach(function(done) {
  truncate.clear(function(result) {
    done();
  })
});

describe("/GET Users", () => {
  it("it should get a user with id 1", () => {
    return userController.getById(1, function(user) {
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
}) 

describe("/POST Users/Signup", () => {
  it("it should signup a user ", done => {
    let person = {
      name: "RonnieOSullivan",
      tag: "RS",
      email: "RonnieOSullivan@email.dk",
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
    let duplicateEmail = {
      name: "Test",
      tag: "LL",
      email: "Bryan@email.dk",
      password: "123456789"
    };
        chai
          .request(server)
          .post("/user/signup")
          .send(duplicateEmail)
          .end((err, res) => {
            res.should.have.status(409);
            done();
          });
  });

  it("it should only signup unique tags", done => {
    let duplicateTag = {
      name: "Kobe Bryan",
      tag: "KB",
      email: "Kobe@smail.dk",
      password: "123456789"
    };
        chai
          .request(server)
          .post("/user/signup")
          .send(duplicateTag)
          .end((err, res) => {
            res.should.have.status(409);
            done();
          });
  });

  it("it should not signup invalid emails", done => {
    let invalidEmail = {
      name: "Kobe Bryan",
      tag: "KB",
      email: "Bryanemail.dk",
      password: "123456789"
    };
    chai
      .request(server)
      .post("/user/signup")
      .send(invalidEmail)
      .end((err, res) => {
        res.should.have.status(400);
        should.exist(res.body.err);
        res.body.err.should.be.a("array");
        done();
      });
  });

  
  it("it should not signup with a short password", done => {
    let invalidPassword = {
      name: "Kobe Bryan",
      tag: "KB",
      email: "Bryanmail.dk",
      password: "1234567"
    };
    chai
      .request(server)
      .post("/user/signup")
      .send(invalidPassword)
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
      .post("/user/signup")
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
  let login = { email: "Bryan@email.dk", password: "123456789" };
  it("it should login a user ", done => {
    chai
      .request(server)
      .post("/user/login")
      .send(login)
      .end((err, res) => {
          userController.getById(1).then(user => {
          res.should.have.status(200);
          done();
        })
      });
  });

  it("it should return generated tokens",  done => {
    chai
      .request(server)
      .post("/user/login")
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
      .post("/user/login")
      .send(login)
      .end((err, res) => {
        userController.getById(1).then(user => {
          should.exist(user.RefreshToken);
          done();
        });
      });
  }); 

  it("it should return 401 on invalid password", done => {
    let invalidLogin = { email: "Bryan@email1.dk", password: "123456" };
    chai
      .request(server)
      .post("/user/login")
      .send(invalidLogin)
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
  });

  it("it should return 401 on emails that don't exist", done => {
    let invalidLogin = { email: "Bryan@email2.dk", password: "123456789" };
    chai
      .request(server)
      .post("/user/login")
      .send(invalidLogin)
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
  });

})

describe("/PATCH Users", () => {
  it("it should update a user", done => {
    let values = { tag: "XXX", name: "newname" };
    chai
      .request(server)
      .patch("/user/")
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

})
 

 

 /* 

 */
  /****************************** TESTING LOGIN *****************************/
/*    describe("/POST User/login", () => {
   
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
  }); */

