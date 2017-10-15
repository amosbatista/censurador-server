module.exports = service;


var service = function(){
	
	const censorStatus = [
		{
			idCensorResult: 0,
			feedBack: 'Citação direta a um crime prescrito na legislação atual.',
			vowToCensor: true,
			searchTerm: /(ladr(a|ã)|assass|estupr|falsific|furt|roub|corrup|mata(r|n)|corromp|pirata)/i
		},
		{
			idCensorResult: 0,
			feedBack: 'Citação direta a um crime prescrito na legislação atual.',
			vowToCensor: true,
			searchTerm: /(thief|murder|rape|falsify|pickin|robbery|corrupt|kill|pira(te|cy))/i
		},

		{
			idCensorResult: 1,
			feedBack: 'Incitação à vingaça e revanchismo.',
			vowToCensor: true,
			searchTerm: /(ving(a|u)|revanch|m(a|á)goa|rancor)/i
		},
		{
			idCensorResult: 1,
			feedBack: 'Incitação à vingaça e revanchismo.',
			vowToCensor: true,
			searchTerm: /(vengean|revenge|retalia|revanch|feel(in|s)|grudge)/i
		},

		{
			idCensorResult: 2,
			feedBack: 'Incitação à traição.',
			vowToCensor: true,
			searchTerm: /(tra(i|í)(d|ç|r)|apunhal)/i
		},
		{
			idCensorResult: 2,
			feedBack: 'Incitação à traição.',
			vowToCensor: true,
			searchTerm: /betray/i
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