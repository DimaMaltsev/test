var logs = require('./logs');
var connectionsStorage = require('./connections-storage');
var rpc = require('./rpc');

function abandonAuthorizeDueToNoServer(socket) {
	logs.addLog('abandoning client auth attempt', socket.connectionId + ' : no server available');
	socket.disconnect();
}

function onRpcClient(socket, message) {
	var serverConnection = connectionsStorage.getServerConnection();
	rpc.send(socket, serverConnection, message);
}

function authorizeClient(socket) {
	connectionsStorage.addClientConnection(socket);

	socket.on('rpc_to_server', onRpcClient.bind(null, socket));

	connectionsStorage.getServerConnection().emit('client_connected', socket.connectionId);
	socket.emit('connected_to_server');
	logs.addLog('authorized client', socket.connectionId);
}

function onAuthorized(socket) {
	if(!connectionsStorage.isServerAuthorized())
		abandonAuthorizeDueToNoServer(socket);
	else
		authorizeClient(socket);
}

module.exports = {
	onAuthorized: onAuthorized
};