var service = function(){


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

			return censorStatus.filter(function(censor){
				return song.lirics.search(censor.searchTerm) > 0;
			});
		}
	}
}

module.exports = service;