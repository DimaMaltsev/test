var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var logs = require('./js/logs');
var init = require('./js/init');

app.get('/server', function(req, res){
	res.sendFile(__dirname + '/html/server.html');
});

app.get('/log', function(req, res){
	res.sendFile(__dirname + '/html/log.html');
});

app.get('/', function(req, res){
 	res.sendFile(__dirname + '/html/index.html');
});

io.on('connection', init.onSocketConnected);

http.listen(3000, function(){
 	console.log('listening on *:3000');
 	logs.addLog('started server', 'localhost:3000');
});
