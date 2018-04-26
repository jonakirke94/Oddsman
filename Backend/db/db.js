const mysql = require('mysql');
const settings = require('./settings');
const test = require('./test_settings');
let config = require('config');

exports.executeSql = function (sql, callback) {

    const conn = mysql.createConnection(config.DbSettings);
    
    conn.connect(function(err) {
        if (err) {
            return callback(null, err);
        }
        conn.query(sql, function (err, result) {
          if (err) {
              return callback(null, err);
          }
          callback(result);         
        });
    });
        

            
};



    

   