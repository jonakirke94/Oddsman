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
});


server.listen(port, function() {
    db.sequelize.sync({
      logging: false
    });
  });



module.exports = server; //for testing