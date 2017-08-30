var service = function(req, res, next){
	//try{
		var config = require("./config");
		var log = require('./logSrv')(config.general);
		var songAPI = require('./vagalumeAPI')(config);
		var cache = require('./censorDatabase_MySQL')(config);
		var theResultList = [];
	/*}
	catch(err){
		console.log(err);
	}*/

	var errorDeal = function(err){
		console.log(JSON.stringify(err));
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

				cache.loadOrSaveSongToCache(resultItem.songName, resultItem.songAPIId, artistId)

			}).catch(function(err){
				errorDeal(err);
			})

		});
	};

	var _processAfterFirstCache = function(theResultList){

		if(theResultList.length >= config.queryLimit)
			_processReturn(theResultList);
		else{


			/* Second: API name */
			var apiSearchQuery = '';

			if(req.query.artistId)
				apiSearchQuery = req.query.songName + ' ' + req.query.artistId;
			else
				apiSearchQuery = req.query.searchValue;

			songAPI.searchSongAndArtist(apiSearchQuery).then(function(apiResult){

				_processCache(apiResult);
				theResultList.concat(apiResult);

				if(theResultList.length >= config.queryLimit)
					_processReturn(theResultList);
				else{


					/* Third: API Song Excerpt*/
					if(req.query.artistId)
						apiSearchQuery = req.query.songName;
					else
						apiSearchQuery = req.query.searchValue;

					songAPI.searchSongExcerpt(apiSearchQuery).then(function(apiResult){
						_processCache(apiResult);
						
						theResultList.concat(apiResult);
						_processReturn(theResultList);

					}).catch(function(err){
						errorDeal(err);
					})
				}

			}).catch(function(err){
				errorDeal(err);
			})
		}
	}

	/* First: cache */
	if(!req.query.artistId){
		
		cache.searchSongIntoCache(req.query.searchValue)

			.then(function(result){
				theResultList.concat(result);

				_processAfterFirstCache(theResultList);
			}).catch(function(err){
				errorDeal(err);
			})
	}
	else{
		cache.searchSongIntoCacheWithArtist(req.query.songName, req.query.artistId).then(function(result){
			theResultList.concat(result);
			_processAfterFirstCache(theResultList);
			
		}).catch(function(err){
			errorDeal(err);
		})
	}

}

module.exports = service;