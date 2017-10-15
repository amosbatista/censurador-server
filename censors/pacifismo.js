
var service = function(){


	const censorStatus = [
		{
			idCensorResult: 0,
			feedBack: 'Pacifismo e outras idéias contrárias ao militarismo e à pátria.',
			vowToCensor: true,
			searchTerm: /(pa(z|cific)|tranq(u|ü)il|sosseg|sereno|relax(a|o))/i
		},

		{
			idCensorResult: 0,
			feedBack: 'Pacifismo e outras idéias contrárias ao militarismo e à pátria.',
			vowToCensor: true,
			searchTerm: /(peace|smooth|quiet|relax)/i
		},

		{
			idCensorResult: 1,
			feedBack: 'Incitação à globalização, contrários ao nacionalismo.',
			vowToCensor: true,
			searchTerm: /(mundial|internaciona|univers|Terra)/i
		},
		{
			idCensorResult: 1,
			feedBack: 'Incitação à globalização, contrários ao nacionalismo.',
			vowToCensor: true,
			searchTerm: /(world|internation)/i
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