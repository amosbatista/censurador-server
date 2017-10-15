
var service = function(){

	const config = require("../config");
	const censorStatus = [
		{
			idCensorResult: 0,
			feedBack: 'Pacifismo e outras idéias contrárias ao militarismo e à pátria.',
			vowToCensor: true,
			searchTerm: /(pa(z|cific)|tranq(u|ü)il|sosseg|sereno|relax(a|o))/i
		},

		{
			idCensorResult: 0,
			feedBack: 'Pacifismo e outras idéias contrárias ao militarismo e à pátria.',
			vowToCensor: true,
			searchTerm: /(peace|smooth|quiet|relax)/i
		},

		{
			idCensorResult: 1,
			feedBack: 'Incitação à globalização, contrários ao nacionalismo.',
			vowToCensor: true,
			searchTerm: /(mundial|internaciona|univers|Terra)/
		},
		{
			idCensorResult: 1,
			feedBack: 'Incitação à globalização, contrários ao nacionalismo.',
			vowToCensor: true,
			searchTerm: /(world|internation)/i
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