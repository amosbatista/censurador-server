var config = require("./config");

var serverSrv = require('./httpServer');
var request = require('./httpServer');
var ioSrv = require('./socketIo');

var censorProcessorsFolder = "censors/";


serverSrv({
	port: config.general.port,

	atStart: function(server){
		console.log("server has just openned.");

		var io = ioSrv(server);
		console.log("socket has just started.");

		var censorDataBaseModule = require("./censorDatabase_MySQL");

		var censorProcessorsModules = config.censorProcessors.process.reduce(function(_finalObject, _processConfig){
			_finalObject[_processConfig.name] = require(censorProcessorsFolder + _processConfig.module);
			return _finalObject;
		}, {});
		

		/* Process */
		io.on(config.censorProcessors.events.processThisSong, function(songData){

			var censorResultList = [];

			censorDataBaseModule.loadSongFromAPI({
				apiId: songData.apiID
			}).then(function(songFromDatabase){

				if(songFromDatabase){

					songFromDatabase.loadedCensorResult.forEach(function(_censorResult){
						censorResultList.push(censorProcessorsModules[_censorResult.name].loadFromResult(_censorResult.resultId));
					});
				}
				else{

					var songAPI = require('./vagalumeAPI')(config.api);

					songAPI.loadSong(songData).then(function(songFromAPI){

						censorProcessorsModules.forEach(function(_censorProcessor){
							censorResultList.push(_censorProcessor.filter(songFromAPI));
						});

					});
				};

				var theSong = songFromDatabase || songFromAPI;


				var censorResult = censorResultList.reduce(function(_censorResult, censor){
					_censorResult.totalVowsToCensor = _censorResult.totalVowsToCensor || 0;
					_censorResult.feedBack = _censorResult.feedBack || [];
					_censorResult.otherFeedBack = _censorResult.otherFeedBack || {};

					if(censor.vowToCensor == true)
						_censorResult.totalVowsToCensor = _censorResult.totalVowsToCensor ++;

					_censorResult.feedBack.push(censor.feedBack);


					_censorResult.otherFeedBack[censor.otherFeedBack.name] = censor.otherFeedBack.value;


					return _censorResult;

				}, {});

				if(censorResult.totalVowsToCensor > 0)
					censorResult.isSongFreeWithObjections = true;
				else
					censorResult.isSongFreeWithObjections = false;

				if(censorResult.totalVowsToCensor > 3)
					censorResult.isSongCensored = true;
				else
					censorResult.isSongCensored = false;

				censorResult.theSong = theSong;

				io.emit(config.censorProcessors.events.showTheResult, censorResult);
			})
		});


	},
	atRequest: function(req, resp){
	}
})
