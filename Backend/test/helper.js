const db = require('../models');

 

/* 
db.sequelize.query("set FOREIGN_KEY_CHECKS=0").then(
  db.users_tournaments.sync({force:true, logging: false}).then(
      db.requests.sync({force:true, logging: false}).then(
          db.users.sync({force:true, logging: false}).then(
              db.tournaments.sync({force:true, logging: false}).then(
                  done() 
              )
          )
      )
  )   
 
);  
 */

exports.clean = (done) => {

  let multiQueryArr = [];
  multiQueryArr.push('SET FOREIGN_KEY_CHECKS = 0;');
  Object.keys(db.sequelize.models).forEach(key => {
    multiQueryArr.push('TRUNCATE ' + db.sequelize.models[key].name + ";");
  });
  multiQueryArr.push('SET FOREIGN_KEY_CHECKS = 1;');

  db.sequelize.query(multiQueryArr.join(' ')).then(function () {
    done();
  })
}

exports.getTour = (options) => {
  const createTour = ({
    name = "Season 1",
    start = new Date("2021-03-25T12:00:00Z"),
    end = new Date("2021-03-25T12:00:00Z")
  } = options) => ({
    name,
    start,
    end
  });
  return createTour(options)
}

exports.getUser = (options) => {
  const createUser = ({
    name = "Kobe Bryan",
    tag = "KB",
    email = "Bryan@email.dk",
    password = "123456789",
  } = options) => ({
    name,
    tag,
    email,
    password
  });
  return createUser(options)
}

/* exports.getTokens = (options) => {
  const createUser = ({
    Email = "Bryan@email.dk",
    UserId = 1,
    IsAdmin = false
  } = options) => ({
    Email,
    UserId,
    IsAdmin
  });
  return tokenController.generateTokens(createUser(options))
} */

/* Object.values(db.sequelize.models).map(function(model) {
  return model.destroy({ truncate: true });
});  */
//sequelize.query();

/* db.sequelize
  .query("set FOREIGN_KEY_CHECKS=0", {logging: false})
  .then(
    usertournament
      .destroy({ truncate: true, force: true, logging: false })
      .then(
        db.sequelize
          .query("set FOREIGN_KEY_CHECKS=0", {logging: false})
          .then(
            request
              .destroy(
                { truncate: true, force: true, logging: false }
         
              )
              .then(
                db.sequelize
                  .query("set FOREIGN_KEY_CHECKS=0", {logging: false})
                  .then(
                    user
                      .destroy(
                        { truncate: true, force: true, logging: false }
              
                      )
                      .then(
                        db.sequelize
                          .query("set FOREIGN_KEY_CHECKS=0", {logging: false})
                          .then(
                            tournament
                              .destroy(
                                { truncate: true, force: true, logging: false }
                              
                              )
                              .then(done())
                          )
                      )
                  )
              )
          )
      )
  );  */