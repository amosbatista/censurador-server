var service = function(config){
	
	return {
		
		searchSongExcerpt: function(q){

			return new Promise(function(resolve, reject){

				var httpMetadata = require('html-metadata');
				var URL = require('url');

				httpMetadata({
					url: URL.parse('http://www.vagalume.com.br/search.php?q=' + q)
				}).then(function(metaResult){
					resolve(metaResult);
				}).catch(function(err){
					reject(err);
				})
			});
		}
	}
};

module.exports = service;