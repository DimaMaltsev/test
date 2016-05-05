var logs = require('./logs');

function sendRPC (socket, targetSocket, message) {
	message.sid = socket.connectionId;

	targetSocket.emit('rpc', message);
	logs.addLog('rpc', message);
}

module.exports = {
	send: sendRPC 
}