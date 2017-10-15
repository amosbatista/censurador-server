
var service = function(){

	const config = require("../config");
	const censorStatus = [
		{
			idCensorResult: 0,
			feedBack: 'Apologia e exaltação da monarquia e outros regimes semelhantes.',
			vowToCensor: true,
			searchTerm: /(monar| rei |rainha|pr(i|í)ncipe|princesa)/i
		},
		{
			idCensorResult: 0,
			feedBack: 'Apologia e exaltação da monarquia e outros regimes semelhantes.',
			vowToCensor: true,
			searchTerm: /( king | queen | prince |princess)/i
		},
		{
			idCensorResult: 1,
			feedBack: 'Incitação à ideias liberais.',
			vowToCensor: true,
			searchTerm: /libera/i
		},
		{
			idCensorResult: 2,
			feedBack: 'Apologia ao parlamentarismo.',
			vowToCensor: true,
			searchTerm: /(parlament|parliam)/i
		},
		{
			idCensorResult: 2,
			feedBack: 'Apologia/citação ao anarquismo.',
			vowToCensor: true,
			searchTerm: /anarq/i
		},
		{
			idCensorResult: 2,
			feedBack: 'Apologia/citação à democracia.',
			vowToCensor: true,
			searchTerm: /democra/i
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