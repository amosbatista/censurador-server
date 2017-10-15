
var service = function(){

	const censorStatus = [
		{
			idCensorResult: 0,
			feedBack: 'Sentimentos negativos, podendo levar a pensamentos suicidas.',
			vowToCensor: true,
			searchTerm: /(desespe|depress|suic|sofr|frust|suffer)/i
		},
		{
			idCensorResult: 1,
			feedBack: 'Suicídio explícito, descrevendo a ação de saltar de lugares altos.',
			vowToCensor: true,
			searchTerm: /(jump (to|from))/i
		},
		{
			idCensorResult: 2,
			feedBack: 'Suicídio explícito, descrevendo a ação de saltar de lugares altos.',
			vowToCensor: true,
			searchTerm: /((pul|jog)[a-z]{1,5} (de|do|para))/i
		},
		{
			idCensorResult: 3,
			feedBack: 'Morte e terminologia mórbida e sombria.',
			vowToCensor: true,
			searchTerm: /(die|death|mor(t|r)(e|i)|o fi(m|nal))/i
		},

		{
			idCensorResult: 4,
			feedBack: 'Sobre medos e eventos que causam pânico e pavor.',
			vowToCensor: true,
			searchTerm: /(med(o|r)|pavor|p(a|â)nic|fear)/i
		},

		{
			idCensorResult: 5,
			feedBack: 'Tristeza profunda, choros.',
			vowToCensor: true,
			searchTerm: /(trist|chor(o|a)|sorrow|sad|cry)/i
		},
		
		{
			idCensorResult: 6,
			feedBack: 'Crueldade e atos de maldade.',
			vowToCensor: true,
			searchTerm: /(cruel|maldi(ç|t)|aberra|terr(i|í|o)|horror|inescrup|curs(e|i))/i
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