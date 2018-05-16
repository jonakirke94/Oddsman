const http = require('http');
const app = require('./app')
const db = require('./models');

const port = 3000;
//const server = http.createServer(app);
const server = require('http').Server(app);
const io = require('socket.io')(server);

io.on('connection', (socket) => {
  console.log('connected');
  
  socket.on('message', (data) => {
    socket.emit('response', 'Thank you for the message');
  });

  socket.on('action', (data) => {
    console.log(data)

    switch(data) {
      case 'refresh_odds':
      console.log('TELL CLIENTS ODDS SHOULD BE REFRESHED!!')
      break;
      case refresh_results:
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