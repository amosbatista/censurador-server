
var service = function(){

	const censorStatus = [
		{
			idCensorResult: 0,
			feedBack: 'Sobre o desvário e a perca da razão.',
			vowToCensor: true,
			searchTerm: /(sem raz(a|ã)o|irracio|louc(a|o|ur)|doid(o|a|ã)|vibe)/i
		},
		{
			idCensorResult: 0,
			feedBack: 'Sobre o desvário e a perca da razão.',
			vowToCensor: true,
			searchTerm: /(no reason|irratio|crazy|mad)/i
		},
		{
			idCensorResult: 1,
			feedBack: 'Necessidade de expor sentimentos, podendo indicar perca da racionalidade e trazendo sentimentos e idéias negativas.',
			vowToCensor: true,
			searchTerm: /(extrava|desabaf|sentir|sinto|unburd)/i
		},

		{
			idCensorResult: 2,
			feedBack: 'Busca pela felicidade egoísta. Sugestão ao hedonismo e libertinagem.',
			vowToCensor: true,
			searchTerm: /(quero ser feliz|be happy)/i
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