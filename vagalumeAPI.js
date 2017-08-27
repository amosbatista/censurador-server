var service = function(config){
	var request = require('./httpClient');


	var _APISearchProcess = function(result){
					
		var objResult = JSON.parse(result);

		return objResult.response.docs.map(function(song){

			var returnObj = {
				artistName: song.band,
				type: ''
			};

			if(item.title){
				returnObj.type = 'song';
				returnObj.songAPIId = item.id;
				returnObj.songName = item.title;

			}else{ 
				returnObj.type = 'artist';
			}

			return returnObj;
		});

	}

	return {
		loadSong: function(param){
			return new Promise(function(resolve, reject){
				if(!param)
					reject('No parameters in load song request;');
				if(!param.songId)
					reject('Empty song ID has been sent in seach request;');

				request(
					{
						url: 'https://api.vagalume.com.br/search.php?apikey=' + config.api.apiKey + '&musid=' + param.songId
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
		searchSongExcerpt: function(q){

			return new Promise(function(resolve, reject){

				var removerAcento = require('./libs/remover-acentos');

				if(!q)
					reject('Nothing in search request;');

				request(
					{
						url: 'https://api.vagalume.com.br/search.excerpt?limit=' + config.queryLimit + '&apikey=' + config.api.apiKey + '&q=' + removerAcento(q.toLowerCase())
					}
				).then(function(result){
					resolve(_APISearchProcess(result));
				}).catch(function(err){
					reject(err);
				})
			});
		},
		searchSongAndArtist: function(q){

			return new Promise(function(resolve, reject){

				var removerAcento = require('./libs/remover-acentos');

				if(!q)
					reject('Nothing in search request;');

				request(
					{
						url: 'https://api.vagalume.com.br/search.artmus?limit=' + config.queryLimit + '&apikey=' + config.api.apiKey + '&q=' + removerAcento(q.toLowerCase())
					}
				).then(function(result){
					resolve(_APISearchProcess(result));
				.catch(function(err){
					reject(err);
				})
			});
		}
	}
};

module.exports = service;