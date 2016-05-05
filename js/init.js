var logs = require('./logs');
var connectionsStorage = require('./connections-storage');
var auth = require('./auth');

function onSocketConnected(socket) {
	connectionsStorage.onConnected(socket);

	socket.on('authorize', auth.onAuthorized.bind(null, socket));
	socket.on('disconnect', connectionsStorage.onDisconnected.bind(null, socket));
}

module.exports = {
	onSocketConnected: onSocketConnected,
}