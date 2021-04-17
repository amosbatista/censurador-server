var noCacheService = function(config){

	var mysql = require('mysql');
	var databaseConfig = require('./databaseConfig')

	return {
		setupDatabase: function(){
			return null;
		},

		loadSong: function(params){
			
			return new Promise (function(resolve){
				resolve(null);
			})			
		},
		saveSong: function(params){
			return new Promise (function(resolve){
				resolve(null);
			})				
		},

		searchArtistIntoCache: function(q){
			
			return new Promise (function(resolve, reject){

				resolve([]);
			});
		},

		searchSongIntoCache: function(q){
			
			return new Promise (function(resolve){

				resolve([]);
			})			
		},
		searchSongIntoCacheWithArtist: function(q, artistId){
			
			return new Promise (function(resolve){

				resolve([]);
			})			
		},

		searchSongIntoCacheWithArtistName: function(q, artistName){
			
			return new Promise (function(resolve){

				resolve([]);
			})			
		},

		loadOrSaveArtistToCache: function(artistName){

			return new Promise (function(resolve, reject){

				resolve(null);
			});
		},

		loadOrSaveSongToCache: function(songName, songAPIId, artistId ){

			return new Promise (function(resolve, reject){
				resolve();
			});
		}
	};
};

module.exports = noCacheService;