var service = function(){
	
	const config = require("../config");
	const censorStatus = [
		{
			idCensorResult: 0,
			feedBack: 'Descrição de personagens afeminados. Sugestão à pederastia.',
			vowToCensor: true,
			searchTerm: /(bich(a|ona)|trave(sti|co)|gay|pederast|sodomi|homosex|queer)/i
		},

		{
			idCensorResult: 1,
			feedBack: 'Descrição de mulhres com traços masculinos.',
			vowToCensor: true,
			searchTerm: /(sapat(ão|ona)|l(e|é)sbi(ca|an)|bi(sex|-sex))/i
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