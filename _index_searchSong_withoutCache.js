var service = function(req, res, next){
	
	var config = require("./config");
	var log = require('./logSrv')(config.general);
	var songAPI = require('./vagalumeAPI')(config);
	var cache = require('./censorDatabase_MySQL')(config);	
	
	var errorDeal = function(err){
		log.write("Error at song search: " + JSON.stringify(err));
		log.write("Error requisition: " + JSON.stringify(req));
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
					cache.loadOrSaveSongToCache(resultItem.songName, resultItem.idAPI, artistId)

			}).catch(function(err){
				errorDeal(err);
			})

		});
	};

	if(req.query.artistName)
		req.query.artistName = req.query.artistName.toLowerCase();
	if(req.query.songName)
		req.query.songName = req.query.songName.toLowerCase();
	if(req.query.searchValue)
		req.query.searchValue = req.query.searchValue.toLowerCase();


	var searchSongFromCache =  null;
	var theResultList = [];
	
	/* Third: API name */
	var apiSearchQuery = '';

	if(req.query.artistName)
		apiSearchQuery = req.query.artistName + ' ' + req.query.songName;
	else
		apiSearchQuery = req.query.searchValue;

	songAPI.searchSongAndArtist(apiSearchQuery).then(function(apiResult){

		_processCache(apiResult);

		/* Result check. This entry can bring other result than the exact name*/
		try{

			if(req.query.artistName){

				apiResult = apiResult.reduce (function(finalList, apiItem){

					if(apiItem.type == 'song'){

						if(
							apiItem.artistName.toLowerCase().search(req.query.artistName) >= 0 && 
							apiItem.songName.toLowerCase().search(req.query.songName) >= 0
						){
							finalList.push(apiItem);
						}
					}

					return finalList;
				}, []);
			}
			else{

				apiResult = apiResult.reduce (function(finalList, apiItem){

					var apiItemName = apiItem.songName || apiItem.artistName;

					if(
						apiItemName.toLowerCase().search(req.query.searchValue) >= 0
					){
						finalList.push(apiItem);
					}

					return finalList;
				}, []);
			}
		}
		catch(err){
			errorDeal(err);
		}

		if(apiResult.length > 0 )
			theResultList = theResultList.concat(apiResult);

		_processReturn(theResultList);

	}).catch(function(err){
		errorDeal(err);
	});
}

module.exports = service;