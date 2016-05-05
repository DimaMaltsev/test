var logs = require('./logs');

var connections = {};
var clientConnections = {};
var serverConnection;
var logConnections = {};
var lastConnectionId = 0;

function onServerDisconnect(socket) {
	disconnectAllAuthorizedClients();
	serverConnection = null;

	logs.addLog('disconnected server', socket.connectionId);
}

function onClientDisconnect(socket) {
	if(serverConnection)
		serverConnection.emit('client_disconnected', socket.connectionId);

	delete clientConnections[socket.connectionId];
	logs.addLog('disconnected client', socket.connectionId);
}

function onLogDisconnect(socket) {
	delete logConnections[socket.connectionId];
	logs.addLog('disconnected logger', socket.connectionId);
}

function onUnauthorizedDisconnect(socket) {
	delete connections[socket.connectionId];
	logs.addLog('disconnected unauthorized', socket.connectionId);
}

function disconnectAllAuthorizedClients() {
	for(var connectionId in clientConnections){
		clientConnections[connectionId].disconnect();
	}
}

function sendLogUpdate(logEntry) {
	for(var connectionId in logConnections)
		logConnections[connectionId].emit('log_update', logEntry);
}

logs.onLogUpdate(sendLogUpdate);

module.exports = {
	onConnected: function (socket) {
		var connectionId = "" + lastConnectionId++;
		socket.connectionId = connectionId;

		connections[connectionId] = socket;

		logs.addLog("connected", socket.connectionId);
	},
	onDisconnected: function(socket) {
		if(serverConnection && socket.connectionId === serverConnection.connectionId) {
			onServerDisconnect(socket);
		} else if(clientConnections.hasOwnProperty(socket.connectionId)) {
			onClientDisconnect(socket);
		} else if(logConnections.hasOwnProperty(socket.connectionId)) {
			onLogDisconnect(socket);
		} else {
			onUnauthorizedDisconnect(socket);
		}
	},
	deleteFromNotAuthorized: function (socket) {
		delete connections[socket.connectionId];
	},
	addLogConnection: function(socket) {
		logConnections[socket.connectionId] = socket;
	},
	addClientConnection: function(socket) {
		clientConnections[socket.connectionId] = socket;
	},
	addServerConnection: function(socket) {
		serverConnection = socket;
	},
	isServerAuthorized: function() {
		return !!serverConnection;
	},
	getServerConnection: function() {
		return serverConnection;
	},
	getClientConnection: function(connectionId) {
		return clientConnections[connectionId];
	}
};