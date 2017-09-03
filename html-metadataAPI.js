var service = function(url){

	return new Promise(function(resolve, reject){

		var httpMetadata = require('html-metadata');
		var URL = require('url');

		httpMetadata({
			url: URL.parse(url)
		}).then(function(metaResult){
			resolve(metaResult);
		}).catch(function(err){
			reject(err);
		})
	});
};

module.exports = service;