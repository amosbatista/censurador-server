var service = function(){


	const censorStatus = [
		{
			idCensorResult: 0,
			feedBack: 'Ritmo música degenerado, ameaçando a cultura juvenil.',
			vowToCensor: true,
			searchTerm: /(samb|rock|metal|funk|pancad(a|ã)o|xote|forr(o|ó)|rap|hip( |-)hop|trash|hardcore|punk|pagode|reggae)/i
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