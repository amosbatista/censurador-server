var config = require("./config");
var serverSrv = require('./routeServer');
//var ioSrv = require('./socketIo');
var Log = require('./logSrv');

var processSong = require('./_index_processSong');
var searchSong = require('./_index_searchSong');
var deepSearchSong = require('./_index_deepSearchSong');

var censorProcessorsFolder = "./censors/";
var censorProcessorsModules;


var log = new Log(config.general);


serverSrv({
	port: config.general.port,

	routeList: [
		{
			url: config.censorProcessors.url.searchSong,
			handle: searchSong
		},

		{
			url: config.censorProcessors.url.processSong,
			handle: processSong
		},

		{
			url: config.censorProcessors.url.deepSearchSong,
			handle: deepSearchSong
		}
	],

	atStart: function(server){

		try{
			var censorDataBaseModule = require("./censorDatabase_MySQL")(config);
			censorDataBaseModule.setupDatabase();
			log.write('Error at database start: ', err);
		}
		catch(err){
			log.write('Server started at port ' + config.general.port);
		};

		censorProcessorsModules = config.censorProcessors.process.reduce(function(_finalObject, _processConfig){
			_finalObject[_processConfig.name] = require(censorProcessorsFolder + _processConfig.module)();
			return _finalObject;
		}, {});
		

		/* Process */
		// io.on(config.censorProcessors.events.processThisSong, function(songData){

			
		// });

		// io.on(config.censorProcessors.events.findThisSong, function(searchData){

		// });
	}
})
