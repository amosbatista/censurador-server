var service = function(req, res, next){

	var config = require("./config");
	var log = require('./logSrv')(config.general);
	var songAPI = require('./vagalumeAPI')(config);
	var censorDataBaseModule = require("./censorDatabase_MySQL")(config);

	var songData = req.query;
	var censorResultList = [];
	var theSong;

	var censorProcessorsFolder = "./censors/";
	var censorProcessorsModules;

	var censorProcessorsModules = config.censorProcessors.process.reduce(function(_list, name){

		_list.push({
			name: name,
			module: require(censorProcessorsFolder + name)()
		});
		return _list;
	}, []);

	var resultProcess = function(){

		var censorResult = censorResultList.reduce(function(_censorResult, censor){

			if(censor.vowToCensor == true)
				_censorResult.totalVowsToCensor++;

			_censorResult.feedBack.push(censor.feedBack);

			// if(censor.otherFeedBack)
			// 	_censorResult.otherFeedBack[censor.otherFeedBack.name] = censor.otherFeedBack.value;

			return _censorResult;

		}, {
			totalVowsToCensor: 0,
			feedBack: []
			//otherFeedBack: {}
		});

		if(censorResult.totalVowsToCensor <= 0)
			censorResult.isSongFreeOfObjections = true;
		else
			censorResult.isSongFreeOfObjections = false;

		if(censorResult.totalVowsToCensor > config.general.resultCountBeforeCensor)
			censorResult.isSongCensored = true;
		else
			censorResult.isSongCensored = false;

		censorResult.theSong = theSong;

		//setTimeout(function() {
			res.send (JSON.stringify(censorResult));
		//}, 5000);
		
		//io.emit(config.censorProcessors.events.showTheResult, censorResult);
	};

	censorDataBaseModule.loadSong(songData).then(function(songFromDatabase){

		if(songFromDatabase != null){

			songFromDatabase.loadedCensorResult.forEach(function(_censorResult){
				var moduleToProcess = censorProcessorsModules.find(function(_censor){
					return _censor.name == _censorResult.processName;
				});

				if(moduleToProcess){
					var censorResult = moduleToProcess.module.loadFromResult(_censorResult.resultId);
					censorResult.censorExcerpt = _censorResult.censorExcerpt;
					censorResultList.push(censorResult);
				}
				//censorResultList.push(censorProcessorsModules[_censorResult.processName].loadFromResult(_censorResult.idCensorResult));
			});

			songFromDatabase.theSong.censorResultList = censorResultList;
			theSong = songFromDatabase.theSong;

			resultProcess();
		}
		else{

			songAPI.loadSong(songData).then(function(songFromAPI){

				theSong = songFromAPI;

				censorProcessorsModules.forEach(function(_censor){
					var censorResult = _censor.module.filter(songFromAPI);

					censorResult.forEach(function(_censorResult){
						_censorResult.processName = _censor.name;
					});

					censorResultList = censorResultList.concat(censorResult);
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