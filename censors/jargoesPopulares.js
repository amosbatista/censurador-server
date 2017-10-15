
var service = function(){

	const config = require("../config");
	const censorStatus = [
		{
			idCensorResult: 0,
			feedBack: 'Dialeto chulo da periferia.',
			vowToCensor: true,
			searchTerm: /(sangue bom|(seu )?dout(ô|or)|truta|grau|firmez(a|ã)| mina |quebrada|zé pov|vida loka|meu irm(ã|a)o)/i
		},
		{
			idCensorResult: 0,
			feedBack: 'Dialeto chulo da periferia.',
			vowToCensor: true,
			searchTerm: /(bro|nigga|m down|fella|thug)/i
		},

		{
			idCensorResult: 1,
			feedBack: 'Dialeto e literatura ordinária do norte/nordeste.',
			vowToCensor: true,
			searchTerm: /(meu rei|mainha|painho|cordel)/i
		},

		{
			idCensorResult: 2,
			feedBack: 'Gírias e palavras da juventude da classe média do litoral. Possível citação de conceitos pacifistas e uso de substâncias ilícitas.',
			vowToCensor: true,
			searchTerm: /((na|deu) onda|maresia)/i
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