var service = function(req, res, next){

	var config = require("./config");
	var log = require('./logSrv')(config.general);
	var songAPI = require('./vagalumeAPI')(config);
	var databaseModule = require('./censorCache_NoCache')(config);
	var theSong;

	var songData = req.query;
	var censorResultList = [];
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

			databaseModule.loadOrSaveArtistToCache(resultItem.artistName).then(function(artistId){

				if(resultItem.type == 'song')
					databaseModule.loadOrSaveSongToCache(resultItem.songName, resultItem.songAPIId, artistId)

			}).catch(function(err){
				errorDeal(err);
			})

		});
	};

	var censorProcessorsFolder = "./censors/";
	var censorProcessorsModules;

	var censorProcessorsModules = config.censorProcessors.process.reduce(function(_finalObject, _processConfig){
		_finalObject[_processConfig.name] = require(censorProcessorsFolder + _processConfig.module)();
		return _finalObject;
	}, {});

	var resultProcess = function(){

		var censorResult = censorResultList.reduce(function(_censorResult, censor){

			if(censor.vowToCensor == true)
				_censorResult.totalVowsToCensor = _censorResult.totalVowsToCensor ++;

			_censorResult.feedBack.push(censor.feedBack);

			// if(censor.otherFeedBack)
			// 	_censorResult.otherFeedBack[censor.otherFeedBack.name] = censor.otherFeedBack.value;

			return _censorResult;

		}, {
			totalVowsToCensor: 0,
			feedBack: []
			//otherFeedBack: {}
		});

		if(censorResult.totalVowsToCensor > 0)
			censorResult.isSongFreeOfObjections = true;
		else
			censorResult.isSongFreeOfObjections = false;

		if(censorResult.totalVowsToCensor > 3)
			censorResult.isSongCensored = true;
		else
			censorResult.isSongCensored = false;

		censorResult.theSong = theSong;

		res.send (JSON.stringify(censorResult));
		//io.emit(config.censorProcessors.events.showTheResult, censorResult);
	};


	songAPI.searchSongAndArtist(songData.artistName + ' ' + songData.songName).then(function(resultList){

		_processCache(resultList);

		var filteredResultList = resultList.reduce(function(total, item){
			if(item.type == 'song'){
				if(item.songName == songData.songName)
					total.songsWithArtistName.push(item);
				else
					total.otherSongs.push(item);
			}

			return total;
		},{
			songsWithArtistName: [],
			otherSongs: []
		});

		if(filteredResultList.songsWithArtistName.length<=0 
			&& filteredResultList.otherSongs.length <= 0
		)
			errorDeal('The re-search from Search API do not bring anything. Search term: ' + songData.artistName + ' ' + songData.songName)
		else{

			var songToLoad;

			if(filteredResultList.songsWithArtistName.length > 0)
				songToLoad = filteredResultList.songsWithArtistName[0];
			else
				songToLoad = filteredResultList.otherSongs[0];

			var songFromDatabase_Promise = null;

			databaseModule.loadSong(songToLoad).then(function(songFromDatabase){
				
				if(songFromDatabase != null){
					theSong = songFromDatabase.theSong;

					songFromDatabase.loadedCensorResult.forEach(function(_censorResult){
						censorResultList.push(censorResultToPush.processName);
					});

					resultProcess();
				}
				else{

					songAPI.loadSong(songToLoad).then(function(songFromAPI){

						theSong = songFromAPI;

						Object.keys(censorProcessorsModules).forEach(function(_censorProcessorName){

							var censorResult = censorProcessorsModules[_censorProcessorName].filter(songFromAPI, _censorProcessorName);
							censorResult.processName = _censorProcessorName;
							censorResultList.push(censorResult);
						});
						
						songFromAPI.censorResultList = censorResultList;
						resultProcess();	
					}).catch(function(err){
						errorDeal(err);
					});
				}

			}).catch(function(err){
				errorDeal(err);
			});
		}


	}).catch(function(err){
		errorDeal(err);
	})
}

module.exports = service;