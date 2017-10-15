var service = function(){
	
	const censorStatus = [
		{
			idCensorResult: 0,
			feedBack: 'Palavras de baixo calão e outros termos chulos e depreciativos.',
			vowToCensor: true,
			searchTerm: /(idiot|babac|troxa|trouxa|ot(a|á)ri|palhaç|porc(o|a)|imbeci|pig)/i
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