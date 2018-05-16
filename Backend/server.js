const http = require('http');
const app = require('./app')
const db = require('./models');

const port = 3000;
//const server = http.createServer(app);
const server = require('http').Server(app);
const io = require('socket.io')(server);

io.on('connection', (socket) => {
  console.log('new connection made');
  
  socket.on('event1', (data) => {
    console.log(data.msg);
  });
  
  socket.emit('event2', {
    msg: 'Server to client, do you read me? Over.'
  });
  
  socket.on('event3', (data) => {
    console.log(data.msg);
    socket.emit('event4', {
      msg: 'Loud and clear :)'
    });
  });
  });


server.listen(port, function() {
    db.sequelize.sync({
      logging: false
    });
  });



module.exports = server; //for testing