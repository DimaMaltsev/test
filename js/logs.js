var log = [];
var saveLogs = true;
var maxLogLength = 100;
var updateCallback;

function addLog(event, details) {
	var date = new Date();
	var logEntry = {
		event: event,
		details: JSON.stringify(details),
		time: date.toISOString()
	};

	if(saveLogs)
		log.push(logEntry);
	
	updateCallback(logEntry);

	if(log.length >= maxLogLength)
		log.shift();
}

module.exports = {
	addLog: addLog,
	getLog: function() { return log },
	onLogUpdate: function(callback){
		updateCallback = callback;
	}
}