var service = function(){

	const censorStatus = [
		{
			id: 0,
			feedBack: 'Nothing wrong'
		},
		{
			id: 1,
			feedBack: "There's 'amor' word. I hate love, censor."
		},

	];

	return: {
		loadFromResult: function(id){

			return censorStatus.find(function(status){
				return status.id == id;
			});
		},
		filter: function(liric){

			if(liric.search('amor') > 0)
				return censorStatus[1];
			else
				return censorStatus[0];

		}
	}
}

module.exports(service);