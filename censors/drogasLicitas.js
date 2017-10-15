
var service = function(){


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

			return censorStatus.filter(function(censor){
				return song.lirics.search(censor.searchTerm) > 0;
			});
		}
	}
}

module.exports = service;