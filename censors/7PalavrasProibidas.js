var service = function(){

	const config = require("../config");
	const censorStatus = [
		{
			idCensorResult: 0,
			feedBack: 'Referência explícita ao orgão genital masculino.',
			vowToCensor: true,
			searchTerm: /(p(e|ê)nis|rôla| pinto |cara(i|lh))/i
		},
		{
			idCensorResult: 0,
			feedBack: 'Referência explícita ao orgão genital masculino.',
			vowToCensor: true,
			searchTerm: /(dick|cock|dong)/i
		},

		{
			idCensorResult: 1,
			feedBack: 'Referência explícita ao aparelho excretor.',
			vowToCensor: true,
			searchTerm: /(cú|cuz(a|ã)|ânus|forévi|anal)/i
		},

		{
			idCensorResult: 1,
			feedBack: 'Referência explícita ao aparelho excretor.',
			vowToCensor: true,
			searchTerm: /( ass |asshole|arse)/i
		},

		{
			idCensorResult: 2,
			feedBack: 'Cita o ato sexual, de uma forma explícita e torpe.',
			vowToCensor: true,
			searchTerm: /(fod(e|a|êr|er)|trans(a|o|u))/i
		},

		{
			idCensorResult: 2,
			feedBack: 'Cita o ato sexual, de uma forma explícita e torpe.',
			vowToCensor: true,
			searchTerm: /fuck/i
		},

		{
			idCensorResult: 3,
			feedBack: 'Cita o excremento humano de forma explícita e/ou torpe.',
			vowToCensor: true,
			searchTerm: /shit/i
		},
		{
			idCensorResult: 4,
			feedBack: 'Contém referência explícita à urina humana.',
			vowToCensor: true,
			searchTerm: /piss/i
		},
		{
			idCensorResult: 5,
			feedBack: 'Referência explícita ao orgão reprodutor feminino.',
			vowToCensor: true,
			searchTerm: /(buceta|vagina|vulva|perseguid)/i
		},
		{
			idCensorResult: 5,
			feedBack: 'Referência explícita ao orgão reprodutor feminino.',
			vowToCensor: true,
			searchTerm: /pussy/i
		},
		{
			idCensorResult: 6,
			feedBack: 'Descrição de ato sexual torpe - oral.',
			vowToCensor: true,
			searchTerm: /(boquet|fela(ca|çã)|chup(a|o))/i
		},
		{
			idCensorResult: 6,
			feedBack: 'Descrição de ato sexual torpe - oral.',
			vowToCensor: true,
			searchTerm: /sucker/i
		},
		{
			idCensorResult: 7,
			feedBack: 'Ofensa de baixo calão ao alvo e a sua respectiva mãe.',
			vowToCensor: true,
			searchTerm: /filh(o|a) (da|de uma) puta/i
		},
		{
			idCensorResult: 7,
			feedBack: 'Ofensa de baixo calão ao alvo e a sua respectiva mãe.',
			vowToCensor: true,
			searchTerm: /motherfuck/i
		},
		{
			idCensorResult: 8,
			feedBack: 'Referência ofensiva ao membro do corpo feminino - mamilo',
			vowToCensor: true,
			searchTerm: /(tet(a|ola)|peit(o|ã)|mamil)/i
		},
		{
			idCensorResult: 8,
			feedBack: 'Referência ofensiva ao membro do corpo feminino - mamilo',
			vowToCensor: true,
			searchTerm: /tits/i
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