var service = function(config){
	var request = require('./httpServer');

	return {
		loadSong: function(param){
			return new Promise(function(resolve, reject){
				request(
					{
						url: 'https://api.vagalume.com.br/search.php?apikey=' = config.apiKey + '&art=' + param.artistName + '&mus=' + param.songName
					}
				).then(function(result){
					if(result.type != 'exact')
						reject('Song has been loaded with status ' + result.type);

					resolve({
						name: param.songName,
						idAPI: result.mus.id,
						lirics: result.mus.id.text,
						idiomID: result.mus.id.lang
					})
					

				}).catch(function(err){
					reject(err);
				})
			});
		}
	}
};

module.exports = service;