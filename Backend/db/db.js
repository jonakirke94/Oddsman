const mysql = require('mysql');
const config = require('config');

exports.executeSql = (sql, callback) => {

    const conn = mysql.createConnection(config.DbSettings) 

    conn.connect(function(err) {
        if (err) {
            conn.end();
            return callback(null, err);
        }
        conn.query(sql, function (err, result) {
          if (err) {
              conn.end();
              return callback(null, err);
          }
          conn.end();
          callback(result);         
          
        });
    });
        

            
};

exports.cleanDatabase = (callback) => {
    const sql = `SET FOREIGN_KEY_CHECKS = 0;
     TRUNCATE Users;
     TRUNCATE Tournaments;
     TRUNCATE Tournament_Users;
     TRUNCATE Requests;
     SET FOREIGN_KEY_CHECKS = 1;`;
    module.exports.executeSql(sql, function(data, err){
      if(err) {
        callback(null, err);
      }
      callback(data);
    })
}



    

   