const http = require('http');
const app = require('./app')
const db = require('./models');

const port = 3000;
//const server = http.createServer(app);
const server = require('http').Server(app);
const io = require('socket.io')(server);
const odds = require('./controllers/odds')



server.listen(port, function () {
  io.on('connect', (socket) => {
    console.log('Connected client on port %s.', port);
    socket.on('action', (data) => {

     switch (data) {
        case 'new_odds':
          odds.get_recent_bets(null, function(bets) {
            if(bets) {
              io.emit('refresh_odds', bets[0])
            }
            console.log('UPDATE FEED! (FROM SERVER)')
          }) 
        
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