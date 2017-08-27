var service = function(req, res, next){

	var songData = req.query;
	var censorResultList = [];
	var censorDataBaseModule = require("./censorDatabase_MySQL")(config.database);
	var theSong;

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

	censorDataBaseModule.loadSong(songData).then(function(songFromDatabase){

		if(songFromDatabase != null){
			theSong = songFromDatabase.theSong;

			songFromDatabase.loadedCensorResult.forEach(function(_censorResult){
				censorResultList.push(censorResultToPush.processName);
			});

			resultProcess();
		}
		else{

			var songAPI = require('./vagalumeAPI')(config.api);

			songAPI.loadSong(songData).then(function(songFromAPI){

				var theSong = songFromAPI;

				Object.keys(censorProcessorsModules).forEach(function(_censorProcessorName){
					var censorResult = censorProcessorsModules[_censorProcessorName].filter(songFromAPI, _censorProcessorName);
					censorResult.processName = _censorProcessorName;

					censorResultList.push(censorResult);
				});

				songFromAPI.censorResultList = censorResultList;

				censorDataBaseModule.saveSong(songFromAPI).then(function(){
					resultProcess();	
				}).catch(function(err){
					log.write("Error at song save into database: " + err);			
					res.send({
						errorMsg: 'Error at song save into database ',
						errorObj: err
					});
				});

			}).catch(function(loadSongLiricError){
				log.write("Error at song liric load: " + loadSongLiricError);
				log.write("Error requisition: " + req);
				res.send({
					errorMsg: 'Error at song liric load ',
					errorObj: loadSongLiricError
				});
			})
		};
	}).catch(function(err){
		log.write("Error at song load from database: " + err);
		log.write("Error requisition: " + req);
		res.send({
			errorMsg: 'Error at song load from database',
			errorObj: err
		});
	});
}

module.exports = service;