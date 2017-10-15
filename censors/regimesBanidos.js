
var service = function(){


	const censorStatus = [
		{
			idCensorResult: 0,
			feedBack: 'Apologia e exaltação da monarquia e outros regimes semelhantes.',
			vowToCensor: true,
			searchTerm: /(monar|rei|rainha|principe|princesa)/i
		},
		{
			idCensorResult: 0,
			feedBack: 'Apologia e exaltação da monarquia e outros regimes semelhantes.',
			vowToCensor: true,
			searchTerm: /(king|queen|prince|princess)/i
		},
		{
			idCensorResult: 1,
			feedBack: 'Incitação à ideias liberais.',
			vowToCensor: true,
			searchTerm: /libera/i
		},
		{
			idCensorResult: 2,
			feedBack: 'Apologia ao parlamentarismo.',
			vowToCensor: true,
			searchTerm: /(parlament|parliam)/i
		},
		{
			idCensorResult: 2,
			feedBack: 'Apologia/citação ao anarquismo.',
			vowToCensor: true,
			searchTerm: /anarq/i
		},
		{
			idCensorResult: 2,
			feedBack: 'Apologia/citação à democracia.',
			vowToCensor: true,
			searchTerm: /democra/i
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