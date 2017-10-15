var service = function(){
	
	const config = require("../config");
	const censorStatus = [
		{
			idCensorResult: 0,
			feedBack: 'Depreciação à oficiais subalternos/altas patentes das forças de patrulhas políciais.',
			vowToCensor: true,
			searchTerm: /(os homens|coxinha|cops)/i
		},

		{
			idCensorResult: 1,
			feedBack: 'Possível citação negativa aos regime ou revolução militar de 1964.',
			vowToCensor: true,
			searchTerm: /(dita ?dura|regime|dictator)/i
		},

		{
			idCensorResult: 2,
			feedBack: 'Descrição chula aos veículos de transporte militar.',
			vowToCensor: true,
			searchTerm: /(viatura|camburão|veraneio)/i
		},

		{
			idCensorResult: 3,
			feedBack: 'Inverdades e faltas citações a procedimentos interrogatório das polícias nacionais.',
			vowToCensor: true,
			searchTerm: /( prender |prisão|mat[a-z]{1-5}|tortur|pers(eg|ig)|cadeia|pres(s|í))/i
		},

		{
			idCensorResult: 3,
			feedBack: 'Inverdades e faltas citações a procedimentos interrogatório das polícias nacionais.',
			vowToCensor: true,
			searchTerm: /(kill|pursuit|jail)/i
		},

		{
			idCensorResult: 4,
			feedBack: 'Opiniões contrárias ao regime e à ordem instaurada no país.',
			vowToCensor: true,
			searchTerm: /(cal(e|a)( ((t|s)ua)|a)? bo(c|q)|repr(ess|im)|shut up)/i
		},

		{
			idCensorResult: 5,
			feedBack: 'Críticas à corrida armamentista americana, especificamente ao uso de armas nucleares. Possível ligação com correntes pacifistas.',
			vowToCensor: true,
			searchTerm: /(at(o|ô)m|nucle|radia(t|ç))/i
		},


		{
			idCensorResult: 6,
			feedBack: 'Formas de execução, praticadas ou não pelo governo.',
			vowToCensor: true,
			searchTerm: /(estrangul|decapita|enforca|fuzila|empala|esfola|cadeira el(e|é)t|injeção let)/i
		},
		{
			idCensorResult: 6,
			feedBack: 'Formas de execução, praticadas ou não pelo governo.',
			vowToCensor: true,
			searchTerm: /(hangin|shoot|impale|skinnin|eletric chair|lethal injec)/i
		}

	];

	return {

		loadFromResult: function(id){
			return censorStatus[id];
		},
		filter: function(song){

			var censorResult = censorStatus.reduce(function(finalList, censor){
				var excerptPosition = song.lirics.search(censor.searchTerm);

				if(excerptPosition > 0){
					censor.censorExcerpt = song.lirics.slice(excerptPosition - config.general.resultExcertpSize, excerptPosition + config.general.resultExcertpSize);
					finalList.push(censor);
				}

				return finalList;

			}, []);

			return censorResult;
		}
	}
}

module.exports = service;