var service = function(config){
	var request = require('./httpClient');

	return {
		loadSong: function(param){
			return new Promise(function(resolve, reject){
				if(!param)
					reject('No parameters in load song request;');
				if(!param.songId)
					reject('Empty song ID has been sent in seach request;');

				request(
					{
						url: 'https://api.vagalume.com.br/search.php?apikey=' + config.apiKey + '&musid=' + param.songId
					}
				).then(function(result){

					var objResult = JSON.parse(result);

					if(objResult.type != 'exact')
						reject('Song has been loaded with status ' + objResult.type);

					resolve({
						songName: objResult.mus[0].name,
						songId: objResult.mus[0].id,
						lirics: objResult.mus[0].text,
						idiomID: objResult.mus[0].lang
					})
					

				}).catch(function(err){
					reject(err);
				})
			});
		},
		searchSong: function(param){

			return new Promise(function(resolve, reject){

				var removerAcento = require('./libs/remover-acentos');

				if(!param)
					reject('No parameters in seach request;');
				if(!param.songName)
					reject('Empty song name has been sent in seach request;');

				request(
					{
						url: 'https://api.vagalume.com.br/search.excerpt?apikey=' + config.apiKey + '&q=' + removerAcento(param.songName.toLowerCase())
					}
				).then(function(result){
					
					var objResult = JSON.parse(result);

					resolve(objResult.response.docs.map(function(song){
						return {
							songId: song.id,
							name: song.title,
							artist: song.band
						}
					}))

				}).catch(function(err){
					reject(err);
				})
			});
		}
	}
};

module.exports = service;