/* param
	atRequest: function(req, resp),
	atStart: function(server),
	port: int
*/
var service = function(param){

	var http = require('http');
	var _httpServer = http.createServer(param.atRequest);

	// Abrir servidor
	_httpServer.listen(param.port, param.atStart(_httpServer));
};




module.exports = service;