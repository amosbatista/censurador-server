var logSrv = function(param){
	var Log = require("log");
	var log = new Log(param.logPath);

	return {
		write: function(text){
			console.log(text);
			log.info(text);
		}
	}

};

module.exports = logSrv;
