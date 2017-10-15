var service = function(){

	const config = require("../config");
	const censorStatus = [
		
		{
			idCensorResult: 0,
			feedBack: 'Malemolência e trejeitos típicos de malandros da periferia, oriundos de danças de favelas, como o samba.',
			vowToCensor: true,
			searchTerm: /(bamb(o|a)|ging)/i
		},
		{
			idCensorResult: 0,
			feedBack: 'Malemolência e trejeitos típicos de malandros da periferia, oriundos de danças de favelas, como o samba.',
			vowToCensor: true,
			searchTerm: /(swing|twist)/i
		},
		{
			idCensorResult: 1,
			feedBack: 'Sugestão a dança sensual e lascividade, incorrendo peversão e corrupção da juventude.',
			vowToCensor: true,
			searchTerm: /(((vem|vai) (desc|sub))|baixadi|rebol|requebr|remex|empina|encaixa)/i
		},
		{
			idCensorResult: 1,
			feedBack: 'Sugestão a dança sensual e lascividade, incorrendo peversão e corrupção da juventude.',
			vowToCensor: true,
			searchTerm: /(get low|twerk|wiggle|twist)/i
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