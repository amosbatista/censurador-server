var service = function(){
	
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

			return censorStatus.filter(function(censor){
				return song.lirics.search(censor.searchTerm) > 0;
			});
		}
	}
}

module.exports = service;