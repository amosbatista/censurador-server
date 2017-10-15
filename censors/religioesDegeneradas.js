module.exports = service;


var service = function(){
	
	const config = require("../config");
	const censorStatus = [
		{
			idCensorResult: 0,
			feedBack: 'Religiões "rastafari" da américa central, que incentivam o uso de drogas.',
			vowToCensor: true,
			searchTerm: /rasta/i
		},

		{
			idCensorResult: 1,
			feedBack: 'Religiões esotéricas, nova era, práticas contrárias ao cristianismo.',
			vowToCensor: true,
			searchTerm: /(energ(ia|y)|zen|medita(c|ç|t)|d?o infinito|infinity|bud(ais)|buddha)/i
		},

		{
			idCensorResult: 2,
			feedBack: 'Descrição explicita ao diabo, e seres demoníacos. Possível exaltação/adoração.',
			vowToCensor: true,
			searchTerm: /(diabo|sat(ã|an)|demon|devil|666|lucifer|infern|hell|abyss)/i
		},

		{
			idCensorResult: 3,
			feedBack: 'Ufologia e outros ensinamentos estranhos de nova-era.',
			vowToCensor: true,
			searchTerm: /(ovni|ufo|alien|e\.t\.|espaço|space)/i
		},

		{
			idCensorResult: 4,
			feedBack: 'Gnosticismo e ideias consideradas heresias pela fé cristã.',
			vowToCensor: true,
			searchTerm: /(arcont|aeon|emana|gnos|Ogd|Pler|Siz(í|i)g)/i
		},

		{
			idCensorResult: 5,
			feedBack: 'Umbanda, candomblé e religiões afro-descendentes, praticas por escravos e pessoas de favelas.',
			vowToCensor: true,
			searchTerm: /(candombl(e|é)|umbanda|ilê|orix|(mãe|pai) de sant|axé|ex(u|ú)|ogum|iemanj|terreiro|oferenda|alê|b(u|ú)zio|espiriti)/i
		},

		{
			idCensorResult: 6,
			feedBack: 'Crenças e folclore indígenas, contrárias a fé vigente no país.',
			vowToCensor: true,
			searchTerm: /((í|i)ndi(o|a|gen)|tupã|caipora|curupira|boitat|saci|guarani| tupi |bumba( |-)meu boi|boi-bumb)/i
		},

		{
			idCensorResult: 7,
			feedBack: 'Paganismo e bruxaria originarias da europa e de outras regiões.',
			vowToCensor: true,
			searchTerm: /( dru(i|í)d| gaia | celt(a|i)| pag(ã|an) | pagão | mãe terra | mother earth |babil(o|ô)n| maldi(t|ç)| brux(a|o)| fadas? |feiti(c|ç)| mag(i|a|o))/i
		},
		{
			idCensorResult: 7,
			feedBack: 'Paganismo e bruxaria originarias da europa e de outras regiões.',
			vowToCensor: true,
			searchTerm: /( fair(y|e)| curse| witch| wizard| mages? |magic)/i
		},
		{
			idCensorResult: 8,
			feedBack: 'Astrologia e outros tipos de superstições.',
			vowToCensor: true,
			searchTerm: /(astro(s|log)|planetas|estrelas|signo|constelaç|cartoma)/i
		},
		{
			idCensorResult: 8,
			feedBack: 'Astrologia e outros tipos de superstições.',
			vowToCensor: true,
			searchTerm: /( planets | stars |constelat|fortune)/i
		},
		{
			idCensorResult: 9,
			feedBack: 'Necromancia, assombrações e assuntos relacionados ao pós-morte, condenados pela igreja e pela sociedade.',
			vowToCensor: true,
			searchTerm: /(necro|fantasm|zumbi|esquelet|cr(a|â)nio|v(a|â)mpir|lobis(o|ô)me|aparição)/i
		},
		{
			idCensorResult: 9,
			feedBack: 'Necromancia, assombrações e assuntos relacionados ao pós-morte, condenados pela igreja e pela sociedade.',
			vowToCensor: true,
			searchTerm: /(ghost|zombie|skull|skeleton|werewol|spirits)/i
		},
		{
			idCensorResult: 10,
			feedBack: 'Islamismo e suas diversas vertentes.',
			vowToCensor: true,
			searchTerm: /(isl(an|ã)|maom(e|é)| al(a|á|lah) |mohammed|muhammad|corão|koran)/i
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