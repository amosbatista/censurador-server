
var service = function(){
	
	const config = require("../config");
	const censorStatus = [
		{
			idCensorResult: 0,
			feedBack: 'Miséria, fome, pobresa e situações que possam ir de encontro à situação economica atual.',
			vowToCensor: true,
			searchTerm: /( fome | famint|pobreza|viol(e|ê)n|mis(e|é)r|v(i|í)ci(o|ad)|escrav|favela|periferia|surb(ú|u)bi)/i
		},
		{
			idCensorResult: 0,
			feedBack: 'Miséria, fome, pobreza e situações que possam ir de encontro à situação economica atual.',
			vowToCensor: true,
			searchTerm: /( hunger | poor | addict| slave | slum )/i
		},
		{
			idCensorResult: 1,
			feedBack: 'Descrição de preconceito racial. Provavel ações afirmativas de esquerda para combate do racismo.',
			vowToCensor: true,
			searchTerm: /(raça|minha cor|negr(o|a|ã|in)|neg(a|o|ão|in)|Luther|nigg)/i
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