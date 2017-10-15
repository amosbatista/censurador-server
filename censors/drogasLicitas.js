
var service = function(){

	const config = require("../config");
	const censorStatus = [
		{
			idCensorResult: 0,
			feedBack: 'Consumo, propaganda ou incentivo à cigarros e semelhantes.',
			vowToCensor: true,
			searchTerm: /(cachimbo|cigarro|piteira|mato seco|fumar|tragar)/i
		},
		{
			idCensorResult: 0,
			feedBack: 'Consumo, propaganda ou incentivo à cigarros e semelhantes.',
			vowToCensor: true,
			searchTerm: /(pipe|cigar|smok|gulp)/i
		},

		{
			idCensorResult: 1,
			feedBack: 'Consumo, propaganda ou incentivo à bebidas alcoólicas.',
			vowToCensor: true,
			searchTerm: /(cacha(c|ç)a|champan|cerveja|breja|whisk|vinh|quentão|aguarden|canhin|51|vodka|chopp|beber|bebida)/i
		},
		{
			idCensorResult: 1,
			feedBack: 'Consumo, propaganda ou incentivo à bebidas alcoólicas.',
			vowToCensor: true,
			searchTerm: /(beer|wine|drink|drunk)/i
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