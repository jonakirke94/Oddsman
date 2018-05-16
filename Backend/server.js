const http = require('http');
const app = require('./app')
const db = require('./models');

const port = 3000;
//const server = http.createServer(app);
const server = require('http').Server(app);
const io = require('socket.io')(server);

io.on('connection', (socket) => {
  console.log('New Connection..')
  socket.on('action', (data) => {
    console.log('DATA:' + data)

    socket.emit('refresh_odds', 'UPDATE FEED! (FROM SERVER)')

    switch(data) {
      case 'new_odds':
      socket.emit('refresh_odds', 'UPDATE FEED! (FROM SERVER)')
      console.log('UPDATE FEED! (FROM SERVER)')
      break;
      case 'new_results':
      console.log('TELL CLIENTS RESULTS SHOULD BE REFRESHED!')
      break; 
    }
  });
}); 


server.listen(port, function() {
    db.sequelize.sync({
      logging: false
    });
  });



module.exports = server; //for testing