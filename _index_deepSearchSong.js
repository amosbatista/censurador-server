/* To use when normal Search doesn't work */
var service = function(req, res, next){
	
	var config = require("./config");
	var log = require('./logSrv')(config.general);
	try{
		var searchAPI = require('./googleAPI')(config);
	}
	catch(err){
		console.log(err)
	}

	var errorDeal = function(err){
		
		log.write("Error at song search: " + JSON.stringify(err));
		log.write("Error requisition: " + req);
		res.send({
			errorMsg: 'Error at song search',
			errorObj: JSON.stringify(err)
		});
	}

	var _processReturn = function(returnList){
		res.send(returnList);
	}

	var promiseResult = null;

	if(req.query.artistName)
		promiseResult = searchAPI.searchBySongAndArtist(req.query.songExcerpt, req.query.artistName);
	else
		promiseResult = searchAPI.searchByAnyTerm(req.query.searchValue);

	promiseResult.then(function(result){
		_processReturn(result);
	}).catch(function(err){
		errorDeal(err);
	});
}

module.exports = service;