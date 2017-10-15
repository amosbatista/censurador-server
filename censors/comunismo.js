module.exports = service;


var service = function(){
	
	const censorStatus = [
		{
			idCensorResult: 0,
			feedBack: 'Referência sutil à movimentos igualitários condenados pela sociedade brasileira.',
			vowToCensor: true,
			searchTerm: /(somos|sou|é|são) (tod(o|os|a|as|x|xs) )?igua(l|is)/i
		},
		{
			idCensorResult: 0,
			feedBack: 'Referência sutil à movimentos igualitários condenados pela sociedade brasileira.',
			vowToCensor: true,
			searchTerm: /are equal/i
		},
		{
			idCensorResult: 1,
			feedBack: 'Termos de discussão da ordem e bons costumes da sociedade.',
			vowToCensor: true,
			searchTerm: /(soci(al|ed)|comu(m|ni)| foro |forum)/i
		},
		{
			idCensorResult: 2,
			feedBack: 'Referência à conceitos total ou parcialmente relacionados ao socialismo.',
			vowToCensor: true,
			searchTerm: /(propriedade|mais valia|assembl(e|é)|guevara|milita|luta de class)/i
		},
		{
			idCensorResult: 2,
			feedBack: 'Referência à conceitos total ou parcialmente relacionados ao socialismo.',
			vowToCensor: true,
			searchTerm: /(propriety|surplus|assembly|guevara|militia|class conflit)/i
		},
		{
			idCensorResult: 3,
			feedBack: 'Citação ao Socialismo e a qualquer simbolismo, movimento ou pensamento equivalente. Risco à normalidade da sociedade. Sugerida investigação contra autor desta música.',
			vowToCensor: true,
			searchTerm: /soci(ali)/i
		},
		{
			idCensorResult: 4,
			feedBack: 'Citação explícita ao Comunismo e a quaisquer movimentos ou pensamentos inimigos da nação e da sociedade brasileira. Moção para imediata censura e investigação dos autores desta música.',
			vowToCensor: true,
			searchTerm: /comun(is|a)/i
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