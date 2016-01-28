var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var people = {};

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){

  socket.on('name entry', function(name){
  	people[socket.id] = name;
  	io.emit('user connected', name + " has signed in");
  	socket.emit('user connected', "hi " + name);
  });
  socket.on('chat message', function(msg){
    io.emit('chat message', msg, people[socket.id]);
  });

  socket.on('disconnect', function(){
  	io.emit('user disconnected', people[socket.id] + " has disconnected");
  	delete people[socket.id];
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});