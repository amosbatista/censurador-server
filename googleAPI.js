var service = function(config){
	var GoogleSearch = require('google-search');
	var googleSearch = new GoogleSearch(config.api.google);

	var _APISearchProcess = function(result){
					
		if(!result.items)
			return [];
		else
			return result.items.map(function(song){

				var returnObj = {
					artistName: '',
					type: 'unknow'
				};

				if( song.pagemap.musicgroup && song.pagemap.musicgroup.length > 0){
					returnObj.artistName = song.pagemap.musicgroup[0].name;
					returnObj.type = 'artist';
				}

				if(song.pagemap.musicrecording && song.pagemap.musicrecording.length > 0){
					returnObj.type = 'song';
					returnObj.songName = song.pagemap.musicrecording[0].name;
				}

				return returnObj;
			});

	}

	return {
		searchBySongAndArtist: function(songExcerpt, artistName){
			return new Promise(function(resolve, reject){
				if(!songExcerpt)
					reject('No song excerpt in deep song search;');
				if(!artistName)
					reject('No artist name in deep song search;');

				googleSearch.build({
					q: artistName + ", " + songExcerpt.replace(/ /g, '_'),
					start: 1,
					num: 10, // ignore the search result, it's interesting to set at max value
					siteSearch: "https://www.vagalume.com.br" // Restricts results to URLs from a specified site 

				}, function(error, response) {

					if(error)
						reject(err)
					else{

						if(response.error)
							reject({
								code: response.error.code,
								message: response.error.message,
							})
						else
							resolve(_APISearchProcess(response));
					}
				})
			});
		},
		searchByAnyTerm: function(songTerm){

			return new Promise(function(resolve, reject){

				if(!songTerm)
					reject('No song term in deep song search;');

				googleSearch.build({
					q: songTerm.replace(/ /g, '_'),
					start: 1,
					num: 10, // ignore the search result, it's interesting to set at max value
					siteSearch: "https://www.vagalume.com.br" // Restricts results to URLs from a specified site 

				}, function(error, response) {
					if(error)
						reject(err)
					else{
						if(response.error)
							reject({
								code: response.error.code,
								message: response.error.message,
							})
						else
							resolve(_APISearchProcess(response));
					}
				})
			});
		}
	}
};

module.exports = service;