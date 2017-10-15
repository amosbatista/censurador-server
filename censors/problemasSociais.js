
var service = function(){
	
	const censorStatus = [
		{
			idCensorResult: 0,
			feedBack: 'Miséria, fome, pobresa e situações que possam ir de encontro à situação economica atual.',
			vowToCensor: true,
			searchTerm: /(fome|famint|pobrez|viol(e|ê)n|mis(e|é)r|v(i|í)ci(o|ad)|escrav|favela|periferia|surb(ú|u)bi)/i
		},
		{
			idCensorResult: 0,
			feedBack: 'Miséria, fome, pobresa e situações que possam ir de encontro à situação economica atual.',
			vowToCensor: true,
			searchTerm: /(hunge|poor|addict|slave|slum)/i
		},
		{
			idCensorResult: 1,
			feedBack: 'Descrição de preconceito racial. Provavel ações afirmativas de esquerda para combate do racismo.',
			vowToCensor: true,
			searchTerm: /(raça|minha cor|negr(o|a|ã)|neg(a|o|ão)|Luther|nigg)/i
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