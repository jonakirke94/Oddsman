const mysql = require('mysql');
const settings = require('./settings')

exports.executeSql = function (sql, callback) {

    const conn = mysql.createConnection(settings.dbConfig);
    
    con.connect(function(err) {
        if (err) {
            callback(null, err);
        }

        con.query(sql, function (err, result) {
          if (err) {
              callback(null, err);
          }

          callback(result);
          
        });
    });
        

            
};



    

   