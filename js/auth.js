var logs = require('./logs');
var connectionsStorage = require('./connections-storage');
var server = require('./server');
var client = require('./client');

function onAuthorizedLog(socket) {
	connectionsStorage.addLogConnection(socket);

	socket.emit('log_init', logs.getLog());
	logs.addLog('authorized log', socket.connectionId);
}

module.exports = {
	onAuthorized: function (socket, type) {
		connectionsStorage.deleteFromNotAuthorized(socket);

		if(type === 'log')
			onAuthorizedLog(socket);
		else if(type === 'server')
			server.onAuthorized(socket);
		else
			client.onAuthorized(socket);
	}
};