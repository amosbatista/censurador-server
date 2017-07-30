var service = function(){

	const censorStatus = [
		{
			idCensorResult: 0,
			feedBack: 'Nothing wrong',
			vowToCensor: false
		},
		{
			idCensorResult: 1,
			feedBack: "There's 'amor' word. I hate love, censor.",
			vowToCensor: true
		},

	];

	return {
		loadFromResult: function(id){

			return censorStatus.find(function(status){
				return status.idCensorResult == id;
			});
		},
		filter: function(song){

			if(song.lirics.search('amor') > 0)
				return censorStatus[1];
			else
				return censorStatus[0];

		}
	}
}

module.exports = service;