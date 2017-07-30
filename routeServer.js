/* param
	port: int,
	routeList: [
		method: 'GET', 'POST',
		url: '/', '/search',
		handle: function(req, res, next)
	]
*/
var service = function(param){

	var http = require('http');
	var Router = require('node-router');
	var router = Router();    // create a new Router instance 
	var route = router.push;  // shortcut for router.push()

	param.routeList.forEach(function (routeSet){
		routeSet.method = routeSet.method || 'GET';
		route(routeSet.method, routeSet.url, routeSet.handle)
	});


	route(function(req){
		console.log('Função de req teste', req);
	}); 


	var _httpServer = http.createServer(router);

	// Start server
	_httpServer.listen(param.port, param.atStart(_httpServer));
};


module.exports = service;