var logs = require('./logs');
var connectionsStorage = require('./connections-storage');
var rpc = require('./rpc');

function onServerWantsToDisconnectClient(socket, clientId) {
	logs.addLog('disconnect client by server', clientId);
	connectionsStorage.getClientConnection(clientId).disconnect();
}

function onRpcServer(socket, message) {
	// message.content = message.content + ''; // HACK

	var target = connectionsStorage.getClientConnection(message.id);
	rpc.send(socket, target, message);
}

function authorizeServer(socket) {
	connectionsStorage.addServerConnection(socket);
	socket.on('disconnect_client', onServerWantsToDisconnectClient.bind(null, socket));
	socket.on('rpc_to_client', onRpcServer.bind(null, socket));

	socket.emit('server_started');
	logs.addLog('authorized server', socket.connectionId);
}

module.exports = {
	onAuthorized: authorizeServer
};