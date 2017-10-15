module.exports = service;


var service = function(){
	const config = require("../config");
	const censorStatus = [
		{
			idCensorResult: 0,
			feedBack: 'Citação direta a um crime prescrito na legislação atual.',
			vowToCensor: true,
			searchTerm: /( ladr(a|ã)| assass| estupr| falsific| furt| roub| corrup| mata(r|n)| corromp| pirata)/i
		},
		{
			idCensorResult: 0,
			feedBack: 'Citação direta a um crime prescrito na legislação atual.',
			vowToCensor: true,
			searchTerm: /( thief| murder| rape | falsify| robbery | corrupt| kill| pira(te|cy))/i
		},

		{
			idCensorResult: 1,
			feedBack: 'Incitação à vingaça e revanchismo.',
			vowToCensor: true,
			searchTerm: /(ving(a|u)|revanch|m(a|á)goa| rancor)/i
		},
		{
			idCensorResult: 1,
			feedBack: 'Incitação à vingaça e revanchismo.',
			vowToCensor: true,
			searchTerm: /(vengean|revenge|retalia|revanch|grudge)/i
		},

		{
			idCensorResult: 2,
			feedBack: 'Incitação à traição.',
			vowToCensor: true,
			searchTerm: /(tra(i|í)(d|ç|r)|apunhal)/i
		},
		{
			idCensorResult: 2,
			feedBack: 'Incitação à traição.',
			vowToCensor: true,
			searchTerm: /betray/i
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