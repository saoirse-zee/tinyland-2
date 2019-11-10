var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

const PORT = 3333

app.get('/', function(req, res){
    res.send('hi from webserver')
});

io.on('connection', function(socket) {
  console.log('a browser connected');
});

http.listen(PORT, function(){
  console.log('listening on ' + PORT);
});

