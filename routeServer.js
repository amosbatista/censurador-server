/* param
	port: int,
	routeList: [
		method: 'GET', 'POST',
		url: '/', '/search',
		handle: function(req, res, next)
	]
*/
var service = function(param){

	const http = require('http');
	const express = require('express')
	const app = express();
	

	/*route(function(req, res, next){
		try{
			res.header('Access-Control-Allow-Origin', '*');
		}
		catch(err){
			console.log('Erro in header', err);
		}
		finally{

			next();
		}
	}); */

	app.use(function (req, res, next) {
		console.log('Making the set')
		res.setHeader('Access-Control-Allow-Origin', '*');
		next();
	});

	param.routeList.forEach(function (routeSet){
		routeSet.method = routeSet.method || 'get';
		app[routeSet.method.toLowerCase()](routeSet.url, routeSet.handle);
	});

	//var _httpServer = http.createServer(router);

	// Start server
	//_httpServer.listen(param.port, param.atStart(_httpServer));
	app.listen(param.port, param.atStart());
};


module.exports = service;