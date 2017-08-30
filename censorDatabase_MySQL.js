var dbService = function(config){

	var mysql = require('mysql');

	return {
		setupDatabase: function(){
			var connection = mysql.createConnection(config.database);
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

					var connection = mysql.createConnection(config.database);
					connection.connect();

					var command = "SELECT P.processName, P.idCensorResult, R.songName FROM censorResult R INNER JOIN censorResultProcess P ON P.idCensor = R.idCensor  WHERE R.idApi = ?";
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
										resultId: result.idCensorResult
									});

									final.theSong.name = final.theSong.name || result.songName

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
					if(!censor.idCensorResult)
						reject('The censor result ' + censorIndex + ' has no result ID;');
					if(typeof censor.idCensorResult != 'number')
						reject('The censor result ID from ' + censorIndex + ' is not a number;');
				});

				try{
					var date = require('./dateSrv');
					var currentDate = date.current();

					var idGenerator = require('./idGenerator');
					idGenerator().then(function(idCensor){

						var connection = mysql.createConnection(config.database);
						connection.connect();

						connection.query(
							'INSERT INTO censorResult(idCensor, idApi, songName, censorDate) VALUES (?, ?, ?, ?)', 
							[
								idCensor,
								params.songId,
								params.songName,		
								date.format(currentDate, 'YYYY-MM-DD HH:mm:ss')
							], function (error, results, fields) {
								if(error)
									reject(error);
							}
						);

						params.censorResultList.forEach(function(censorResult){
							connection.query(
								'INSERT INTO censorResultProcess (idCensor, processName, idCensorResult) VALUES (?, ?, ?)',
								[
									idCensor,
									censorResult.processName,
									censorResult.idCensorResult
								]
								, function (error, results, fields) {
									if(error)
										reject(error);
								}
							);
						}, '');

						connection.end();
						resolve();

					}).catch(function(uidError){
						reject(uidError);	
					})
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

					var connection = mysql.createConnection(config.database);
					connection.connect();

					var command = "SELECT A.artistName, S.songName, S.idAPI, A.idSearch "
						+ "FROM searchCache_artist A "
						+ "INNER JOIN searchCache_song S ON A.idSearch = S.idSearch_Artist "
						+ " WHERE A.artistName LIKE ? OR S.songName LIKE ? LIMIT " + config.general.queryLimit + ";"

					console.log(command);

					connection.query(command, [
						'%' + q + '%', '%' + q + '%'
					], function (error, results, fields) {

						console.log(error);
						connection.end();

						if (error)
							reject(error);
						else{
								
							if(results.length <= 0)
								resolve(null);
							else{
								resolve(result);
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

					var connection = mysql.createConnection(config.database);
					connection.connect();

					var command = "SELECT S.songName, S.idAPI "
						+ "FROM searchCache_artist A "
						+ "INNER JOIN searchCache_song S ON A.idSearch = S.idSearch_Artist "
						+ " WHERE S.songName LIKE '%?%' AND S.idSearch_Artist = ? LIMIT " + config.general.queryLimit + ";"

					connection.query(command, [
						q, artistId
					], function (error, results, fields) {

						connection.end();

						if (error)
							reject(error);
						else{
								
							if(results.length <= 0)
								resolve(null);
							else{

								resolve(result);
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

				var connection = mysql.createConnection(config.database);
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

				var connection = mysql.createConnection(config.database);
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