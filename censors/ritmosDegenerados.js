var service = function(){

	const config = require("../config");
	const censorStatus = [
		{
			idCensorResult: 0,
			feedBack: 'Ritmo música degenerado, ameaçando a cultura juvenil.',
			vowToCensor: true,
			searchTerm: /( samba(-| )| rock(-| )| metal(-| )|funk|pancad(a|ã)o| xote | forr(o|ó) | rap | hip( |-)hop | trash | hard(-| )?core | punk | pagode | reggae )/i
		}
	];

	return {

		loadFromResult: function(id){
			return censorStatus[id];
		},
		filter: function(song){

			var censorResult = censorStatus.reduce(function(finalList, censor){
				var excerptPosition = song.lirics.search(censor.searchTerm);

				if(excerptPosition > 0){
					censor.censorExcerpt = song.lirics.slice(excerptPosition - config.general.resultExcertpSize, excerptPosition + config.general.resultExcertpSize);
					finalList.push(censor);
				}

				return finalList;

			}, []);

			return censorResult;
		}
	}
}

module.exports = service;