const mysql = require('mysql');
const settings = require('./settings')

exports.executeSql = function (sql, callback) {

    console.log(settings.dbConfig);

    const conn = mysql.createConnection(settings.dbConfig);
    
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



    

   