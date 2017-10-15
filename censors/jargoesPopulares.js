
var service = function(){


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
			feedBack: 'Dialeto ordinário do norte/nordeste.',
			vowToCensor: true,
			searchTerm: /(meu rei|mainha|painho)/i
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

			return censorStatus.filter(function(censor){
				return song.lirics.search(censor.searchTerm) > 0;
			});
		}
	}
}

module.exports = service;