var service = function(){
	
	const config = require("../config");
	const censorStatus = [
		{
			idCensorResult: 0,
			feedBack: 'Sugestão a namoricos e relações sexuais entre adolescentes.',
			vowToCensor: true,
			searchTerm: /(paquer|azaraç|flirt)/i
		},

		{
			idCensorResult: 1,
			feedBack: 'Pregar/narrar relações sem compromissos, indo contra o conceito de família.',
			vowToCensor: true,
			searchTerm: /(sem comprom|free love)/i
		},

		{
			idCensorResult: 2,
			feedBack: 'Busca desenfreada do prazer e desejo carnal.',
			vowToCensor: true,
			searchTerm: /((eu desejo)|desejos|prazer|sensua|lib(i|í)d|wish|pleasure)/i
		},

		{
			idCensorResult: 3,
			feedBack: 'Comentários explícitos sobre o corpo alheio.',
			vowToCensor: true,
			searchTerm: /(s|teu )?corp(o|ão|inh|your body)/i
		},

		{
			idCensorResult: 4,
			feedBack: 'Descrição explícita de conjução carnal.',
			vowToCensor: true,
			searchTerm: /((fazer|fiz|faço) (amor|sexo)|make love)/i
		},

		{
			idCensorResult:5,
			feedBack: 'Colocação sutil ao ato sexual, citando o leito como meio de prepertar o ato.',
			vowToCensor: true,
			searchTerm: /(colch(a|ã)o|cama|leito| bed |lay down)/i
		},
		{
			idCensorResult: 6,
			feedBack: 'Comentário sexual a pessoa jovem. Possibilidade de ação ou apologia à pedofilia.',
			vowToCensor: true,
			searchTerm: /(ess(e|a)s ?menin(o|a)s?|novinh|(this|that) (boy|girl))/i
		},
		{
			idCensorResult: 7,
			feedBack: 'Descrição explicita e libidinosa de uma pessoa do sexo oposto.',
			vowToCensor: true,
			searchTerm: /(gostos(o|a|ão|ona)|gorgeo)/i
		},
		{
			idCensorResult: 8,
			feedBack: 'Comentário perjorativo sobre a parte posterior de uma pessoa.',
			vowToCensor: true,
			searchTerm: /( bund|bumbum|bum bum|poupan(c|ç)| ass |booty)/i
		},

		{
			idCensorResult: 9,
			feedBack: 'Personagem namorador, atrevido e sem pudor de seus atos.',
			vowToCensor: true,
			searchTerm: /(pegad(a|dor)| (as)sanha( |d)|deng(o|ui))/i
		},

		{
			idCensorResult:10,
			feedBack: 'Descrição ofensiva à pessoa que nunca teve relações sexuais.',
			vowToCensor: true,
			searchTerm: /(caba(c|ç)|virg(e|in)| bv )/i
		},
		{
			idCensorResult:11,
			feedBack: 'Locais e eventos promíscuos corruptores da juventude e dos bons costumes.',
			vowToCensor: true,
			searchTerm: /(balada|inferninho| pub |fest(a|inh)|curti|bord(e|é)(l|is)|party|carnaval|folia|frevo)/i
		},
		{
			idCensorResult:12,
			feedBack: 'Comportamento fogoso e libidinoso.',
			vowToCensor: true,
			searchTerm: /(on fire|peg(a|ando|ar) fogo)/i
		},
		{
			idCensorResult:13,
			feedBack: 'Comportamento fogoso e libidinoso.',
			vowToCensor: true,
			searchTerm: /(paix(a|ã)o|(pra|vai) abalar| passion )/i
		},
		{
			idCensorResult:14,
			feedBack: 'Descrição de mulheres lascívas que se vendem por dinheiro.',
			vowToCensor: true,
			searchTerm: /(programa|prostit|puta|vagabunda|piranha|safada|vadia|whore|bitch)/i
		},
		{
			idCensorResult:15,
			feedBack: 'Referência sutil à relação sexual.',
			vowToCensor: true,
			searchTerm: /(uma noite|the night)/i
		},
		{
			idCensorResult:16,
			feedBack: 'Referência sutil à relação sexual.',
			vowToCensor: true,
			searchTerm: /((se|me|nos) ama|sexo|mak(e|in'|ing) (love|sex))/i
		},
		{
			idCensorResult:17,
			feedBack: 'Explicitação ao nú, seja artístico, seja sexual.',
			vowToCensor: true,
			searchTerm: /(nú|pelad|sem roup|naked)/i
		},
		{
			idCensorResult:18,
			feedBack: 'Descrição de beijo, contato carnal pelos lábios.',
			vowToCensor: true,
			searchTerm: /(beij(o|a|ã)| kiss )/i
		},
		{
			idCensorResult:20,
			feedBack: 'Comentários explícitos sobre o corpo alheio.',
			vowToCensor: true,
			searchTerm: /cintur(a|in| waist | hip )/i
		},
		{
			idCensorResult:21,
			feedBack: 'Roupas e apetrechos íntimos/sexuais.',
			vowToCensor: true,
			searchTerm: /(cueca|calcinha|b(i|í)quin|suti(en|ã|an)|maiô|lingerie|pantie| bra )/i
		},
		{
			idCensorResult:22,
			feedBack: 'Praticas sexuais abomináveis e criminosas.',
			vowToCensor: true,
			searchTerm: /(sodom(i|y)|bacanal|org(ia|y)|putaria|suruba)/i
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