var service = function(){
	
	const config = require("../config");
	const censorStatus = [
		{
			idCensorResult: 0,
			feedBack: 'Frases e chavões vindas da juventude rebelde da atualidade.',
			vowToCensor: true,
			searchTerm: /proibido proibir/i
		},
		{
			idCensorResult: 1,
			feedBack: 'Citação explicita de rebelião ao governo nacional.',
			vowToCensor: true,
			searchTerm: /(derr(u|i)bar (o|a)s?|take (it )?down)/i
		},
		{
			idCensorResult: 2,
			feedBack: 'Apologia feminista a práticas contrárias à sociedade cristã, como aborto, controle de natalidade e divórcio.',
			vowToCensor: true,
			searchTerm: /(meu corpo|my body)/i
		},
		{
			idCensorResult: 3,
			feedBack: 'Pensamentos rebeldes, rejeição ao pensamento conservador, sugestão ao ativismo.',
			vowToCensor: true,
			searchTerm: /(na mente|na cabe(c|ç)a|cérebro|my mind|brain)/i
		},
		{
			idCensorResult: 4,
			feedBack: 'Radicalização de ações.',
			vowToCensor: true,
			searchTerm: /radical/i
		},
		{
			idCensorResult: 5,
			feedBack: 'Referência sutil à cerca. Crítica de fronteiras e nacionalismo.',
			vowToCensor: true,
			searchTerm: /( cerca |fronteira|fence|frontier)/i
		},
		{
			idCensorResult: 6,
			feedBack: 'Descrição de opiniões e alternativas a moral e bons costumes.',
			vowToCensor: true,
			searchTerm: /(opin(i|a)|altern)/i
		},
		{
			idCensorResult: 7,
			feedBack: 'Declamação de sentimentos de liberdade e libertinagem.',
			vowToCensor: true,
			searchTerm: /(li(ber|vre)|freedom)/i
		},
		{
			idCensorResult: 8,
			feedBack: 'Pensamentos e idéias futuristicas, possívelmente indo de encontro à conceitos tradicionalista.',
			vowToCensor: true,
			searchTerm: /futur(o|e)/i
		},
		{
			idCensorResult: 9,
			feedBack: 'Aventura e rejeição ao tradicional e monótono.',
			vowToCensor: true,
			searchTerm: /(aventur|adventu)/i
		},

		{
			idCensorResult: 10,
			feedBack: 'Conflito e incentivo à luta.',
			vowToCensor: true,
			searchTerm: /(inimi(g|z)|advers|combat|conflit| luta |guerra|batalh|rixa|arrebent|protest|manifesta)/i
		},

		{
			idCensorResult: 10,
			feedBack: 'Conflito e incentivo à luta.',
			vowToCensor: true,
			searchTerm: /(enem(i|y)|conflict|war|fight|battle|punch|rally)/i
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