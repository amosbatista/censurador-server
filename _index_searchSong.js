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
		res.send(returnList);
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

	var _processAfterFirstCache = function(theResultList){
		
		if(theResultList.length >= config.general.queryLimit)
			_processReturn(theResultList);
		else{

			/* Second: API name */
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
						apiItemName.search(apiSearchQuery) > 0
					){
						finalList.push(apiItem);
					}

					return finalList;
				}, []);

				if(apiResult.length > 0 )
					theResultList = theResultList.concat(apiResult);

				_processReturn(theResultList);

			}).catch(function(err){
				errorDeal(err);
			})
		}
	}

	/* First: cache */
	if(req.query.artistId){
		cache.searchSongIntoCacheWithArtist(req.query.songName, req.query.artistId).then(function(result){
			console.log("Resultados do cache com artista", result)
			_processAfterFirstCache(result);
			
		}).catch(function(err){
			errorDeal(err);
		})

	}
	else{
		cache.searchSongIntoCache(req.query.searchValue)

			.then(function(result){
				console.log("Resultados do cache", result)
				_processAfterFirstCache(result);
			}).catch(function(err){
				errorDeal(err);
			})

	}

}

module.exports = service;