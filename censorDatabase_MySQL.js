var dbService = function(config){

	var mysql = require('mysql');

	return {
		setupDatabase: function(){
			var connection = mysql.createConnection(config);
			connection.connect();

			/* Check table creation */
			var baseCommand = 'CREATE TABLE IF NOT EXISTS censorResultProcess (idCensor VARCHAR(50) NOT NULL, processName VARCHAR(50) NOT NULL, idCensorResult INT NOT NULL);'

			connection.query(baseCommand, function (error, results, fields) {
				if (error) 
					throw('Error at check "processo"', error);
			});

			baseCommand = 'CREATE TABLE IF NOT EXISTS censorResult (idCensor VARCHAR(50) NOT NULL, idApi VARCHAR(50) NOT NULL, songName VARCHAR(100) NOT NULL,censorDate DATETIME NOT NULL);'

			connection.query(baseCommand, function (error, results, fields) {
				if (error) 
					throw('Error at check "resultado"', error);
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

					var connection = mysql.createConnection(config);
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

					var UIDGenerator = require('uid-generator');
					var uidgen3 = new UIDGenerator(128, UIDGenerator.BASE62);

					uidgen3.generate().then(function(idCensor){

						var connection = mysql.createConnection(config);
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

						resolve();

					}).catch(function(uidError){
						reject(uidError);	
					})
				}
				catch(err){
					reject(err);
				}
			})				
		}
	};
};

module.exports = dbService;