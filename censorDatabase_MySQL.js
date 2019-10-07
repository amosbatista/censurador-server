var dbService = function(config){

	var mysql = require('mysql');
	var databaseConfig = require('./databaseConfig')

	return {
		setupDatabase: function(){
			var connection = mysql.createConnection(databaseConfig);
			var databaseCommandList = require('./database_command_creation');
			connection.connect();

			/* Check table creation */
			databaseCommandList.commandList.forEach(function(commandItem){

				connection.query(commandItem.command, function (error, results, fields) {
					if (error) 
						throw('Error at database check "' + commandItem.name + '"', error);
				});	
			});

			connection.end();
		},

		loadSong: function(params){
			
			return new Promise (function(resolve, reject){

				if(!params)
					reject('No parameters in load song from database;');
				if(!params.songId)
					reject('Empty song ID has been sent in database load;');

				try{

					var connection = mysql.createConnection(databaseConfig);
					connection.connect();

					var command = "SELECT P.processName, P.idCensorResult, R.songName, R.artistName, R.url, P.censorExcerpt FROM censorResult R INNER JOIN censorResultProcess P ON P.idCensor = R.idCensor WHERE R.idApi = ?";

					connection.query(command, [
						params.songId
					], function (error, results, fields) {

						connection.end();

						if (error)
							reject(error);
						else{
								
							if(results.length <= 0)
								resolve(null);
							else{
								var resultProcessed = results.reduce(function(final, result){
									final.loadedCensorResult.push({
										processName: result.processName,
										resultId: result.idCensorResult,
										censorExcerpt: result.censorExcerpt
									});

									final.theSong.artistName = result.artistName;
									final.theSong.songName = result.songName;
									final.theSong.songId = params.songId;
									final.theSong.lirics = null;
									final.theSong.idiomID = null;
									final.theSong.url = result.url;
									final.theSong;

									return final;
								}, {
									loadedCensorResult: [],
									theSong: {}
								});

								resolve(resultProcessed);
							}
						}
					});
				}
				catch(err){
					reject(err);
				}
			})			
		},
		saveSong: function(params){
			return new Promise (function(resolve, reject){

				if(!params)
					reject('No parameters sent to database save;');
				if(!params.songId)
					reject('Empty song ID has been sent in database save;');
				if(!params.songName)
					reject('Empty song name has been sent in database save;');

				if(!params.censorResultList)
					reject('The song has not passed into any censor;');
				if(params.censorResultList.length <= 0)
					reject('The song has not passed into any censor;');

				params.censorResultList.forEach(function(censor, censorIndex){
					censor.processName = censor.processName || '';
					
					if(censor.processName == '')
						reject('The censor result ' + censorIndex + ' has no name process;');
					if(censor.censorExcerpt == '')
						reject('The censor result ' + censorIndex + ' has no excerpt;');
					if(censor.idCensorResult == null || censor.idCensorResult == undefined)
						reject('The censor result ' + censorIndex + ' has no result ID;');
					if(typeof censor.idCensorResult != 'number')
						reject('The censor result ID from ' + censorIndex + ' is not a number;');
				});

				try{
					var date = require('./dateSrv');
					var currentDate = date.current();

					var idGenerator = require('./idGenerator');

					idGenerator().then(function(idCensor){

						var connection = mysql.createConnection(databaseConfig);
						connection.connect();
						connection.query(
							'INSERT INTO censorResult(idCensor, idApi, songName, artistName, censorDate, url) VALUES (?, ?, ?, ?, ?, ?)', 
							[
								idCensor,
								params.songId,
								params.songName,
								params.artistName,
								date.format(currentDate, 'YYYY-MM-DD HH:mm:ss'),
								params.url
							], function (error, results, fields) {

								if(error)
									reject(error);
								else{

									params.censorResultList.forEach(function(censorResult){
										connection.query(
											'INSERT INTO censorResultProcess (idCensor, processName, idCensorResult, censorExcerpt) VALUES (?, ?, ?, ?)',
											[
												idCensor,
												censorResult.processName,
												censorResult.idCensorResult,
												censorResult.censorExcerpt
											]
											, function (error, results, fields) {
												if(error)
													reject(error);
											}
										);
									}, '');

									connection.end();
									resolve();

								}
							}
						);

					}).catch(function(uidError){
						reject(uidError);	
					})
				}
				catch(err){
					reject(err);
				}
			})				
		},

		searchArtistIntoCache: function(q){
			
			return new Promise (function(resolve, reject){

				if(!q)
					reject('Empty parameters in artist search from cache;');
				
				try{

					var connection = mysql.createConnection(databaseConfig);
					connection.connect();

					var command = "SELECT artistName, idSearch, 'artist' AS type "
						+ "FROM searchCache_artist "
						+ " WHERE artistName LIKE ? LIMIT " + config.general.queryLimit + ";"

					connection.query(command, [
						'%' + q + '%'
					], function (error, results, fields) {

						connection.end();

						if (error)
							reject(error);
						else{
								
							if(results.length <= 0)
								resolve([]);
							else{
								resolve(results);
							}
						}
					});
				}
				catch(err){
					reject(err);
				}
			})			
		},

		searchSongIntoCache: function(q){
			
			return new Promise (function(resolve, reject){

				if(!q)
					reject('Empty parameters in song search from cache;');
				
				try{

					var connection = mysql.createConnection(databaseConfig);
					connection.connect();

					var command = "SELECT A.artistName, S.songName, S.idAPI, A.idSearch, 'song' as type "
						+ "FROM searchCache_artist A "
						+ "INNER JOIN searchCache_song S ON A.idSearch = S.idSearch_Artist "
						+ " WHERE S.songName LIKE ? LIMIT " + config.general.queryLimit + ";"

					connection.query(command, [
						'%' + q + '%'
					], function (error, results, fields) {

						connection.end();

						if (error)
							reject(error);
						else{
								
							if(results.length <= 0)
								resolve([]);
							else{
								/*results = results.map(function(result){
									result.type = 'song';
									return result;
								});*/

								resolve(results);
							}
						}
					});
				}
				catch(err){
					reject(err);
				}
			})			
		},
		searchSongIntoCacheWithArtist: function(q, artistId){
			
			return new Promise (function(resolve, reject){

				if(!q)
					reject('Empty parameters in song with artist search from cache;');
				if(!artistId)
					reject('No artist ID in load song from cache;');
				
				try{

					var connection = mysql.createConnection(databaseConfig);
					connection.connect();

					var command = "SELECT S.songName, S.idAPI, 'song' as type "
						+ "FROM searchCache_artist A "
						+ "INNER JOIN searchCache_song S ON A.idSearch = S.idSearch_Artist "
						+ " WHERE S.songName LIKE ? AND S.idSearch_Artist = ? LIMIT " + config.general.queryLimit + ";"

					connection.query(command, [
						'%' + q + '%',
						artistId
					], function (error, results, fields) {

						connection.end();

						if (error)
							reject(error);
						else{
								
							if(results.length <= 0)
								resolve([]);
							else{

								/*results = results.map(function(result){
									result.type = 'song';
									return result;
								});*/

								resolve(results);
							}
						}
					});
				}
				catch(err){
					reject(err);
				}
			})			
		},

		searchSongIntoCacheWithArtistName: function(q, artistName){
			
			return new Promise (function(resolve, reject){

				if(!q)
					reject('Empty parameters in song with artist search from cache;');
				if(!artistName)
					reject('No artist name in load song from cache;');
				
				try{

					var connection = mysql.createConnection(databaseConfig);
					connection.connect();

					var command = "SELECT S.songName, S.idAPI, 'song' as type "
						+ "FROM searchCache_artist A "
						+ "INNER JOIN searchCache_song S ON A.idSearch = S.idSearch_Artist "
						+ " WHERE S.songName LIKE ? AND A.artistName = ? LIMIT " + config.general.queryLimit + ";"

					connection.query(command, [
						'%' + q + '%',
						artistName
					], function (error, results, fields) {

						connection.end();

						if (error)
							reject(error);
						else{
								
							if(results.length <= 0)
								resolve([]);
							else{
								resolve(results);
							}
						}
					});
				}
				catch(err){
					reject(err);
				}
			})			
		},

		loadOrSaveArtistToCache: function(artistName){

			return new Promise (function(resolve, reject){

				if(!artistName || artistName == '')
					reject('Artist name is null at saveArtistToCache');

				var connection = mysql.createConnection(databaseConfig);
				connection.connect();

				var command = "SELECT idSearch "
					+ "FROM searchCache_artist "
					+ " WHERE artistName = ?"

				connection.query(command, [
					artistName
				], function (error, results, fields) {

					if(error){
						connection.end();
						reject('Error at artist search in cache:' + error);
						return;
					}
					if(results.length <= 0){

						var idGenerator = require('./idGenerator');
						idGenerator().then(function(newId){

							connection.query(
								'INSERT INTO searchCache_artist (idSearch, artistName) VALUES(?,?)', 
								[
									newId, artistName
								],
								function (error, results, fields) {
									connection.end();

									if(error)
										reject('Error at artist insertion in cache:' + error);
									else
										resolve(newId);
								}
							);
						});
					}
					else{
						connection.end();
						resolve(results[0].idSearch);
					}
				})
			});
		},

		loadOrSaveSongToCache: function(songName, songAPIId, artistId ){

			return new Promise (function(resolve, reject){

				if(!songName || songName == '')
					reject('Song name is empty at save song to cache');
				if(!songAPIId || songAPIId == '')
					reject('Song API ID is empty at save song to cache');
				if(!artistId || artistId == '')
					reject('Artist ID is empty at save song to cache');

				var connection = mysql.createConnection(databaseConfig);
				connection.connect();

				var command = "SELECT 1 "
					+ "FROM searchCache_song "
					+ " WHERE idAPI = ?"

				connection.query(command, [
					songAPIId
				], function (error, results, fields) {

					if(error){
						connection.end();
						reject('Error at artist search in cache:' + error);
						return;
					}
					if(results.length <= 0){

						var idGenerator = require('./idGenerator');
						idGenerator().then(function(newId){

							connection.query(
								'INSERT INTO searchCache_song (idSearch, idSearch_Artist, songName, idAPI) VALUES(?,?,?,?)', 
								[
									newId, artistId, songName, songAPIId
								],
								function (error, results, fields) {
									connection.end();
									if(error)
										reject('Error at artist insertion in cache:' + error);
									else
										resolve();
								}
							);
						});
					}
					else{
						connection.end();
						resolve();
					}
				})
			});
		}
	};
};

module.exports = dbService;