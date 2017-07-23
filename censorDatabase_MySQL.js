var dbService = function(config){

	var mysql = require('mysql');

	var connection = mysql.createConnection(config);
	connection.connect();

	/* Check table creation */
	var baseCommand = 'CREATE TABLE IF NOT EXIST censorResult_Process (';
	baseCommand = baseCommand + 'idCensor VARCHAR NOT NULL,'
	baseCommand = baseCommand + 'processName VARCHAR NOT NULL,'
	baseCommand = baseCommand + 'idCensorResult INT NOT NULL);'

	connection.query(baseCommand, function (error, results, fields) {
		if (error) throw error;
		
		baseCommand = 'CREATE TABLE IF NOT EXIST censorResult (';
		baseCommand = baseCommand + 'idCensor VARCHAR NOT NULL,'
		baseCommand = baseCommand + 'idApi INT NOT NULL,'
		baseCommand = baseCommand + 'songName INT NOT NULL,'
		baseCommand = baseCommand + 'censorDate DATETIME NOT NULL);'

		connection.query(baseCommand, function (error, results, fields) {
			if (error) throw error;
		});

	});

	connection.end();

	return {
		loadSong: function(params){
			
			return new Promise (function(resolve, reject){

				try{
					var connection = mysql.createConnection();
					connection.connect();

					var command = "SELECT P.processName, P.idCensorResult, P.songName FROM censorResult R INNER JOIN censorResult_Process P ON P.idCensor = R.idCensor  WHERE R.idApi = ?";
					connection.query(command, [
						params.idApi
					], function (error, results, fields) {

						connection.end();

						if (error)
							reject(error);
						else{
							var resultProcessed = results.reduce(function(final, result){
								final.loadedCensorResult.push({
									name: result.processName,
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
					});
				}
				catch(err){
					reject(err);
				}
			})			
		},
		saveSong: function(params){
			return new Promise (function(resolve, reject){

				try{
					var date = require('./dateSrv');
					var currentDate = date.current();

					var UIDGenerator = require('uid-generator');
					var uidgen3 = new UIDGenerator(128, UIDGenerator.BASE62);
					uidgen3.generate().then(function(idCensor){

						var connection = mysql.createConnection();
						connection.connect();

						connection.query(
							'INSERT INTO censorResult(idCensor, idApi, songName, censorDate) VALUES (?, ?, ?, ?)', 
							[
								idCensor,
								params.idApi,
								params.songName,		
								currentDate.toString();
							], function (error, results, fields) {
								if(error)
									reject(error);
							};
						);

						params.censorResultList.forEach(function(censorResult){
							connection.query(
								'INSERT INTO censorResult_Process (idCensor, processName, idCensorResult) VALUES (?, ?, ?)',
								[
									idCensor,
									censorResult.processName,
									censorResult.idCensorResult
								]
								, function (error, results, fields) {
									if(error)
										reject(error);
								};
							);
						}, '');

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