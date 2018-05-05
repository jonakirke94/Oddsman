const http = require('http');
const app = require('./app')
var db = require('./models');

const port = 3000;
const server = http.createServer(app);

server.listen(port, function() {
    db.sequelize.sync({
      logging: false
    });
  });


module.exports = server; //for testing