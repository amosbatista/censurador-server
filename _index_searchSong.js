var service = function(req, res, next){
	
	var config = require("./config");
	var log = require('./logSrv')(config.general);
	var songAPI = require('./vagalumeAPI')(config);
	var cache = require('./censorDatabase_MySQL')(config);	
	
	var errorDeal = function(err){
		log.write("Error at song search: " + JSON.stringify(err));
		log.write("Error requisition: " + req);
		res.send({
			errorMsg: 'Error at song search',
			errorObj: JSON.stringify(err)
		});
	}

	var _processReturn = function(returnList){
		res.send({
			result: returnList
		});
	}

	/* Async cache process */
	var _processCache = function(apiResult){

		apiResult.forEach(function(resultItem){

			cache.loadOrSaveArtistToCache(resultItem.artistName).then(function(artistId){

				if(resultItem.type == 'song')
					cache.loadOrSaveSongToCache(resultItem.songName, resultItem.songAPIId, artistId)

			}).catch(function(err){
				errorDeal(err);
			})

		});
	};


	var searchSongFromCache =  null;
	var theResultList = [];

	/* First: sound from cache */
	console.log('Query', JSON.stringify(req.query));
	if(req.query.artistName)
		searchSongFromCache = cache.searchSongIntoCacheWithArtistName(req.query.songName, req.query.artistName);
	else
		searchSongFromCache = cache.searchSongIntoCache(req.query.searchValue);

	searchSongFromCache.then(function(songResult){
		console.log("Resultados do cache", songResult)

		theResultList = theResultList.concat(songResult);

		if(theResultList.length >= config.general.queryLimit)
			_processReturn(theResultList);
		else{

			if(req.query.artistName){
				
				/* Third: API name */
				var apiSearchQuery = '';

				if(req.query.artistName)
					apiSearchQuery = req.query.artistName + ' ' + req.query.songName;
				else
					apiSearchQuery = req.query.searchValue;

				songAPI.searchSongAndArtist(apiSearchQuery).then(function(apiResult){

					console.log("Resultados da API - Nome da música", apiResult)
					_processCache(apiResult);

					/* Result check. This entry can bring other result than the exact name*/
					apiResult = apiResult.reduce (function(finalList, apiItem){
						var apiItemName = apiItem.songName || apiItem.artistName;

						if(
							apiItemName.search(req.query.searchValue) >= 0 ||
							(
								apiItem.artistName.search(req.query.artistName) >= 0 && 
								apiItem.songName.search(req.query.songName) >= 0
							)
						){
							finalList.push(apiItem);
						}

						console.log('API search: ' + apiItemName + ' -find: ' + apiItemName.search(apiSearchQuery))

						return finalList;
					}, []);

					if(apiResult.length > 0 )
						theResultList = theResultList.concat(apiResult);

					_processReturn(theResultList);

				}).catch(function(err){
					errorDeal(err);
				});

			}
			else{

				/* Second: artist from cache*/			
				cache.searchArtistIntoCache(req.query.searchValue).then(function(artistResult){

					theResultList = theResultList.concat(artistResult);

					if(theResultList.length >= config.general.queryLimit)
						_processReturn(theResultList);
					else{				

						/* Third: API name */
						var apiSearchQuery = '';

						if(req.query.artistName)
							apiSearchQuery = req.query.artistName + ' ' + req.query.songName;
						else
							apiSearchQuery = req.query.searchValue;

						songAPI.searchSongAndArtist(apiSearchQuery).then(function(apiResult){

							console.log("Resultados da API - Nome da música", apiResult)
							_processCache(apiResult);

							/* Result check. This entry can bring other result than the exact name*/
							apiResult = apiResult.reduce (function(finalList, apiItem){
								var apiItemName = apiItem.songName || apiItem.artistName;

								if(
									apiItemName.search(apiSearchQuery) >= 0
								){
									finalList.push(apiItem);
								}

								console.log('API search: ' + apiItemName + ' -find: ' + apiItemName.search(apiSearchQuery))

								return finalList;
							}, []);

							if(apiResult.length > 0 )
								theResultList = theResultList.concat(apiResult);

							_processReturn(theResultList);

						}).catch(function(err){
							errorDeal(err);
						})
					}
				}).catch(function(err){
					errorDeal(err);
				});
			}
		}

	}).catch(function(err){
		errorDeal(err);
	});


}

module.exports = service;