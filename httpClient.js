function service(param){

	return new Promise (function(resolve, reject){

		var http = require('http');
		var URL = require('url');

		param = param || {};
		param.encoding = param.encoding || 'utf8';
		param.url = param.url || '';

		var opt = URL.parse(param.url);

		var httpReq = http.request(opt, function(response){
			response.setEncoding('utf8');

			var content = '';

			response.on('data', function(partialContent){
				content = content + partialContent;
			});

			response.on('end', function(){
				resolve(content);
			});

			response.on('error', function(e){
				reject(e);
			})
		})

		httpReq.end();
	});
};





module.exports = service;