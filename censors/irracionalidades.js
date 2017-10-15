
var service = function(){

	const config = require("../config");
	const censorStatus = [
		{
			idCensorResult: 0,
			feedBack: 'Sobre o desvário e a perca da razão.',
			vowToCensor: true,
			searchTerm: /(sem raz(a|ã)o|irracio|louc(a|o|ur)|doid(o|a|ã)|vibe)/i
		},
		{
			idCensorResult: 0,
			feedBack: 'Sobre o desvário e a perca da razão.',
			vowToCensor: true,
			searchTerm: /(no reason|irratio|crazy| mad )/i
		},
		{
			idCensorResult: 1,
			feedBack: 'Necessidade de expor sentimentos, podendo indicar perca da racionalidade e trazendo sentimentos e idéias negativas.',
			vowToCensor: true,
			searchTerm: /(extrava|desabaf| sentir | sinto |unburd)/i
		},

		{
			idCensorResult: 2,
			feedBack: 'Busca pela felicidade egoísta. Sugestão ao hedonismo e libertinagem.',
			vowToCensor: true,
			searchTerm: /(quero ser feliz|be happy)/i
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