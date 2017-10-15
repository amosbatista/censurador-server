
var service = function(){

	const config = require("../config");
	const censorStatus = [
		{
			idCensorResult: 0,
			feedBack: 'Drogas proibidas por lei, oriúndas de tribos e reservas indígenas.',
			vowToCensor: true,
			searchTerm: /cachimbo da paz/i
		},

		{
			idCensorResult: 1,
			feedBack: 'Descrição de vícios em geral.',
			vowToCensor: true,
			searchTerm: /(addict|stoned)/i
		},

		{
			idCensorResult: 1,
			feedBack: 'Descrição de vícios em geral.',
			vowToCensor: true,
			searchTerm: /(dependen|viciad|chapa(d|r)|acend(er|a|i) um)/i
		},

		{
			idCensorResult: 2,
			feedBack: 'Plantio ou consumo de maconha para usos religiosos, medicinais ou recreativos.',
			vowToCensor: true,
			searchTerm: /(maconha|fogo na bomba|palhinha|canabis|cannabis)/i
		},
		{
			idCensorResult: 2,
			feedBack: 'Plantio ou consumo de maconha para usos religiosos, medicinais ou recreativos.',
			vowToCensor: true,
			searchTerm: /(blunt|weed|marijuana|pot)/i
		},

		{
			idCensorResult: 3,
			feedBack: 'Plantio ou consumo de plantas alucinógeneas para usos religiosos, medicinais ou recreativos.',
			vowToCensor: true,
			searchTerm: /(cogumelo|santo daime|mato seco)/i
		},
		{
			idCensorResult: 3,
			feedBack: 'Plantio ou consumo de plantas alucinógeneas para usos religiosos, medicinais ou recreativos.',
			vowToCensor: true,
			searchTerm: /mushroom/i
		},

		{
			idCensorResult: 4,
			feedBack: 'Produção e consumo de drogas ilícitas fortes.',
			vowToCensor: true,
			searchTerm: /(crack|hero(i|í)n|coca(i|í)n|anfetamin|stimulant|lan(c|ç)a( |-)perfum|ópio|opium)/i
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