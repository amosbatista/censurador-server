require('dotenv').config();
var config = require("./config");
var serverSrv = require('./routeServer');
//var ioSrv = require('./socketIo');
var Log = require('./logSrv');

var processSong = require('./_index_processSong');
var searchSong = require('./_index_searchSong_withoutCache');
var deepSearchSong = require('./_index_deepSearchSong');
var processSongFromDeepSearch = require('./_index_processSongFromDeep');

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
		},

		{
			url: config.censorProcessors.url.processSongFromDeepSearch,
			handle: processSongFromDeepSearch
		}
	],

	atStart: function(){

		try{
			var censorDataBaseModule = require("./censorDatabase_MySQL")(config);
			censorDataBaseModule.setupDatabase();
			log.write('Error at database start: ', err);
		}
		catch(err){
			log.write('Server started at port ' + config.general.port);
		};
		

		/* Process */
		// io.on(config.censorProcessors.events.processThisSong, function(songData){

			
		// });

		// io.on(config.censorProcessors.events.findThisSong, function(searchData){

		// });
	}
})
