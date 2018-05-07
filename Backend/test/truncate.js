const db = require('../models');




/*     const user = db.users;
    const tournament = db.tournaments
    const usertournament = db.users_tournaments
    const request = db.requests  */


    /* db.sequelize.query("set FOREIGN_KEY_CHECKS=0").then(
        db.users_tournaments.sync({force:true, logging: false}).then(
            db.requests.sync({force:true, logging: false}).then(
                db.users.sync({force:true, logging: false}).then(
                    db.tournaments.sync({force:true, logging: false}).then(
                        done() 
                    )
                )
            )
        )   
       
    );  */


exports.clear = (done) => {
    let multiQueryArr = [];    
    multiQueryArr.push('SET FOREIGN_KEY_CHECKS = 0;');
    Object.values(db.sequelize.models).forEach(element => {
      multiQueryArr.push('TRUNCATE '+ element.name + ";");
    });
    multiQueryArr.push('SET FOREIGN_KEY_CHECKS = 1;');

    db.sequelize.query(multiQueryArr.join(' ')).then(function(){
      done();
    })
}
    

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
 
