var service = {

	current: function(){
		var moment = require('moment');
		return moment();
	}
};

/*	var langPadrao = 'pt-br';

	// Gerar um objeto que retorna 2 datas (a de hoje, e a semana passada)
	var _periodoSemana = function(){
		return {
			dataHoje: moment(),
			dataSemanaPassada: moment().subtract(1,'weeks'),
			dataAte: moment(),
			dataDe: moment().subtract(1,'weeks'),
		};
	};

	var _periodoDia = function(){
		return {
			dataHoje: moment(),
			dataOntem: moment().subtract(1,'days'),
			dataAte: moment(),
			dataDe: moment().subtract(1,'days')
		};
	};
	
	var _periodoMes = function(){

		return {
			dataAte: moment(),
			dataDe: moment().subtract(1,'months')
		};
	};

	var _periodoBimestre = function(){

		return {
			dataAte: moment(),
			dataDe: moment().subtract(2, 'months')
		};
	};

	var _periodoTrimestre = function(){

		return {
			dataAte: moment(),
			dataDe: moment().subtract(3, 'months')
		};
	};

	var _periodoSemestre = function(){

		return {
			dataAte: moment(),
			dataDe: moment().subtract(6, 'months')
		};
	};

	var _periodoAno = function(){

		return {
			dataAte: moment(),
			dataDe: moment().subtract(1, 'years')
		};
	};


	return {

		dataHoraAtual: function(){
			
		},

		dataHoje: function(){
			return moment();
		},

		formatarSegundo: function(hora){
			if(hora == undefined || hora == null)
				return;

			var dataLocal = moment(hora, 'HH:mm:ss');
			return dataLocal.second();
		},

		formatarData: function (data, lang){
			if(data == undefined || data == null)
				return;

			if(lang == undefined || lang == null)
				lang = langPadrao;

			var dataLocal = moment(data);
			dataLocal.locale(lang);
			return dataLocal.format('L');

		},

		// Exemplo 08/12
		formatarData_Cartao: function (data, lang){
			if(data == undefined || data == null)
				return;

			if(lang == undefined || lang == null)
				lang = langPadrao;

			var dataLocal = moment(data);
			dataLocal.locale(lang);
			return dataLocal.format('MM/YY');

		},

		// Padrão YYYY-MM-DD
		formatarDataSistema: function (data){
			if(data == undefined || data == null)
				return undefined;
			if(data == "")
				return undefined;
			
			var dataLocal = moment(data);

			return dataLocal.format('YYYY-MM-DD');

		},

		// Padrão YYYY-MM-DD HH:MM:SS
		formatarDataHoraSistema: function (data){
			if(data == undefined || data == null)
				return;
			
			var dataLocal = moment(data);

			return dataLocal.format('YYYY-MM-DD HH:mm:ss');

		},

		formatarDataHora: function (data, lang){
			if(data == undefined || data == null)
				return;

			if(lang == undefined || lang == null)
				lang = langPadrao;

			var dataLocal = moment(data);
			dataLocal.locale(lang);
			return dataLocal.format('L LTS');

		},

		diferenca: function (data1, data2, formato){
			var data1Momnt = moment(data1);
			var data2Momnt = moment(data2);
			var diferenca = data2Momnt.diff(data1Momnt, formato);
			return diferenca;

		},

		criarObjetoData: function (data){
			return moment(data);
		},

		// Gerar um objeto que retorna 2 datas (a de hoje, e a semana passada)
		periodoSemana: _periodoSemana,

		periodoDia: _periodoDia,

		periodoPorParametro: function(tipoPeriodo){

			switch(tipoPeriodo){
				case "dia":
					return _periodoDia()
				case 'wek':
					return _periodoSemana()
				case 'mes':
					return _periodoMes()
				case 'bim':
					return _periodoBimestre()
				case 'tri':
					return _periodoTrimestre()
				case 'sem':
					return _periodoSemestre()
				case 'ano':
					return _periodoAno()
			}
		}
	};
});*/

module.exports = service;