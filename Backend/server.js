const http = require('http');
const app = require('./app')
const db = require('./models');

const port = 3000;
//const server = http.createServer(app);
const server = require('http').Server(app);
const io = require('socket.io')(server);




server.listen(port, function () {
/*   io.on('connection', (socket) => {
    console.log('Connected client on port %s.', port);
    socket.on('action', (data) => {

      socket.emit('refresh_odds', 'UPDATE FEED! (FROM SERVER)')

     switch (data) {
        case 'new_odds':
          socket.emit('refresh_odds', 'UPDATE FEED! (FROM SERVER)')
          console.log('UPDATE FEED! (FROM SERVER)')
          break;
        case 'new_results':
          console.log('TELL CLIENTS RESULTS SHOULD BE REFRESHED!')
          break;
      } 
    });
  }); */

  io.on('connect', (socket) => {
    console.log('Connected client on port %s.', port);
    socket.on('action', (data) => {

     switch (data) {
        case 'new_odds':
          io.emit('refresh_odds', 'UPDATE FEED! (FROM SERVER)')
          console.log('UPDATE FEED! (FROM SERVER)')
          break;
        case 'new_results':
          console.log('TELL CLIENTS RESULTS SHOULD BE REFRESHED!')
          break;
      } 
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
  })
});



module.exports = server; //for testing