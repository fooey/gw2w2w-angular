
/*!
 *
 *	Services - GW2DataSvc
 *
 !*/

angular.module('gw2app').service('GW2DataSvc', [function() {
	'use strict';


	/*
	*	Public Properties
	*/

	var svc = {
		regions: [
			{key: 'NA', name: 'North America'},
			{key: 'EU', name: 'Europe'},
		],
		langs: [
			{sort: 1, slug: 'en', label: 'EN', href: '/en', name: 'English'},
			{sort: 2, slug: 'de', label: 'DE', href: '/de', name: 'Deutsch'},
			{sort: 3, slug: 'es', label: 'ES', href: '/es', name: 'Español'},
			{sort: 4, slug: 'fr', label: 'FR', href: '/fr', name: 'Français'},
		],

		wvw: {
			colors: ['red', 'blue', 'green'],

			worldsConfig: [{
				'index': 0,
				'worldId': 'red_world_id',
				'team': 'Red',
				'color': 'red',
				'listClass': 'list-group-item-danger',
				'panelClass': 'panel-danger',
			},{
				'index': 1,
				'worldId': 'blue_world_id',
				'team': 'Blue',
				'color': 'blue',
				'listClass': 'list-group-item-info',
				'panelClass': 'panel-info',
			},{
				'index': 2,
				'worldId': 'green_world_id',
				'team': 'Green',
				'color': 'green',
				'listClass': 'list-group-item-success',
				'panelClass': 'panel-success',
			},],

			commonNames: {
				'en': ",Overlook,Valley,Lowlands,Golanta Clearing,Pangloss Rise,Speldan Clearcut,Danelon Passage,Umberglade Woods,Stonemist Castle,Rogue's Quarry,Aldon's Ledge,Wildcreek Run,Jerrifer's Slough,Klovan Gully,Langor Gulch,Quentin Lake,Mendon's Gap,Anzalias Pass,Ogrewatch Cut,Veloka Slope,Durios Gulch,Bravost Escarpment,Garrison,Champion's Demense,Redbriar,Greenlake,Ascension Bay,Dawn's Eyrie,The Spiritholme,Woodhaven,Askalion Hills,Etheron Hills,Dreaming Bay,Victor's Lodge,Greenbriar,Bluelake,Garrison,Longview,The Godsword,Cliffside,Shadaran Hills,Redlake,Hero's Lodge,Dreadfall Bay,Bluebriar,Garrison,Sunnyhill,Faithleap,Bluevale Refuge,Bluewater Lowlands,Astralholme,Arah's Hope,Greenvale Refuge,Foghaven,Redwater Lowlands,The Titanpaw,Cragtop,Godslore,Redvale Refuge,Stargrove,Greenwater Lowlands,Temple of Lost Prayers,Battle's Hollow,Bauer's Estate,Orchard Overlook,Carver's Ascent,Carver's Ascent,Orchard Overlook,Bauer's Estate,Battle's Hollow,Temple of Lost Prayers,Carver's Ascent,Orchard Overlook,Bauer's Estate,Battle's Hollow,Temple of Lost Prayers".split(','),
				'fr': ",Belvédère,Vallée,Basses terres,Clairière de Golanta,Montée de Pangloss,Forêt rasée de Speldan,Passage Danelon,Bois d'Ombreclair,Château Brumepierre,Carrière des voleurs,Corniche d'Aldon,Piste du Ruisseau sauvage,Bourbier de Jerrifer,Petit ravin de Klovan,Ravin de Langor,Lac Quentin,Faille de Mendon,Col d'Anzalias,Percée de Gardogre,Flanc de Veloka,Ravin de Durios,Falaise de Bravost,Garnison,Fief du champion,Bruyerouge,Lac Vert,Baie de l'Ascension,Promontoire de l'aube,L'antre des esprits,Gentesylve,Collines d'Askalion,Collines d'Etheron,Baie des rêves,Pavillon du vainqueur,Vertebranche,Lac bleu,Garnison,Longuevue,L'Epée divine,Flanc de falaise,Collines de Shadaran,Rougelac,Pavillon du Héros,Baie du Noir déclin,Bruyazur,Garnison,Colline ensoleillée,Ferveur,Refuge de bleuval,Basses terres d'Eau-Azur,Astralholme,Espoir d'Arah,Refuge de Valvert,Havre gris,Basses terres de Rubicon,Bras du titan,Sommet de l'escarpement,Divination,Refuge de Valrouge,Bosquet stellaire,Basses terres d'Eau-Verdoyante,Temple des prières perdues,Vallon de bataille,Domaine de Bauer,Belvédère du Verger,Côte du couteau,Côte du couteau,Belvédère du Verger,Domaine de Bauer,Vallon de bataille,Temple des prières perdues,Côte du couteau,Belvédère du Verger,Domaine de Bauer,Vallon de bataille,Temple des prières perdues".split(','),
				'es': ",Mirador,Valle,Vega,Claro Golanta,Colina Pangloss,Claro Espeldia,Pasaje Danelon,Bosques Clarosombra,Castillo Piedraniebla,Cantera del Pícaro,Cornisa de Aldon,Pista Arroyosalvaje,Cenagal de Jerrifer,Barranco Klovan,Barranco Langor,Lago Quentin,Zanja de Mendon,Paso Anzalias,Tajo de la Guardia del Ogro,Pendiente Veloka,Barranco Durios,Escarpadura Bravost,Fuerte,Dominio del Campeón,Zarzarroja,Lagoverde,Bahía de la Ascensión,Aguilera del Alba,La Isleta Espiritual,Refugio Forestal,Colinas Askalion,Colinas Etheron,Bahía Onírica,Albergue del Vencedor,Zarzaverde,Lagoazul,Fuerte,Vistaluenga,La Hoja Divina,Despeñadero,Colinas Shadaran,Lagorrojo,Albergue del Héroe,Bahía Salto Aciago,Zarzazul,Fuerte,Colina Soleada,Salto de Fe,Refugio Valleazul,Tierras Bajas de Aguazul,Isleta Astral,Esperanza de Arah,Refugio de Valleverde,Refugio Neblinoso,Tierras Bajas de Aguarroja,La Garra del Titán,Cumbrepeñasco,Sabiduría de los Dioses,Refugio Vallerojo,Arboleda de las Estrellas,Tierras Bajas de Aguaverde,Templo de las Pelgarias,Hondonada de la Battalla,Hacienda de Bauer,Mirador del Huerto,Ascenso del Trinchador,Ascenso del Trinchador,Mirador del Huerto,Hacienda de Bauer,Hondonada de la Battalla,Templo de las Pelgarias,Ascenso del Trinchador,Mirador del Huerto,Hacienda de Bauer,Hondonada de la Battalla,Templo de las Pelgarias".split(','),
				'de': ",Aussichtspunkt,Tal,Tiefland,Golanta-Lichtung,Pangloss-Anhöhe,Speldan Kahlschlag,Danelon-Passage,Umberlichtung-Forst,Schloss Steinnebel,Schurkenbruch,Aldons Vorsprung,Wildbachstrecke,Jerrifers Sumpfloch,Klovan-Senke,Langor - Schlucht,Quentinsee,Mendons Spalt,Anzalias-Pass,Ogerwacht-Kanal,Veloka-Hang,Durios-Schlucht,Bravost-Abhang,Festung,Landgut des Champions,Rotdornstrauch,Grünsee,Bucht des Aufstiegs,Horst der Morgendammerung,Der Geisterholm,Wald - Freistatt,Askalion - Hügel,Etheron - Hügel,Traumbucht,Sieger - Hütte,Grünstrauch,Blausee,Festung,Weitsicht,Das Gottschwert,Felswand,Shadaran Hügel,Rotsee,Hütte des Helden,Schreckensfall - Bucht,Blaudornstrauch,Festung,Sonnenlichthügel,Glaubenssprung,Blautal - Zuflucht,Blauwasser - Tiefland,Astralholm,Arahs Hoffnung,Grüntal - Zuflucht,Nebel - Freistatt,Rotwasser - Tiefland,Die Titanenpranke,Felsenspitze,Götterkunde,Rottal - Zuflucht,Sternenhain,Grünwasser - Tiefland,Tempel der Verlorenen Gebete,Schlachten-Senke,Bauers Anwesen,Obstgarten Aussichtspunkt,Aufstieg des Schnitzers,Aufstieg des Schnitzers,Obstgarten Aussichtspunkt,Bauers Anwesen,Schlachten-Senke,Tempel der Verlorenen Gebete,Aufstieg des Schnitzers,Obstgarten Aussichtspunkt,Bauers Anwesen,Schlachten-Senke,Tempel der Verlorenen Gebete".split(','),
			},

			objectiveTypes: {
				'1': {id: 1, timer: 1, value: 35, type: 'castle'},
				'2': {id: 2, timer: 1, value: 25, type: 'keep'},
				'3': {id: 3, timer: 1, value: 10, type: 'tower'},
				'4': {id: 4, timer: 1, value: 5, type: 'camp'},
				'5': {id: 5, timer: 0, value: 0, type: 'temple'},
				'6': {id: 6, timer: 0, value: 0, type: 'hollow'},
				'7': {id: 7, timer: 0, value: 0, type: 'estate'},
				'8': {id: 8, timer: 0, value: 0, type: 'overlook'},
				'9': {id: 9, timer: 0, value: 0, type: 'ascent'},
			},

			objectiveMeta: {
				//	EBG
				9: {type: 1, timer: 1, d: 0, n: 0, s: 0, w: 0, e: 0},		// Stonemist Castle

				1: {type: 2, timer: 1, d: 1, n: 1, s: 0, w: 0, e: 0},		// Red Keep - Overlook
				17: {type: 3, timer: 1, d: 1, n: 1, s: 0, w: 1, e: 0},	// Red Tower - Mendon's Gap
				20: {type: 3, timer: 1, d: 1, n: 1, s: 0, w: 0, e: 1},	// Red Tower - Veloka Slope
				18: {type: 3, timer: 1, d: 1, n: 0, s: 1, w: 1, e: 0},	// Red Tower - Anzalias Pass
				19: {type: 3, timer: 1, d: 1, n: 0, s: 1, w: 0, e: 1},	// Red Tower - Ogrewatch Cut
				6: {type: 4, timer: 1, d: 1, n: 0, s: 0, w: 1, e: 0},		// Red Camp - Mill - Speldan
				5: {type: 4, timer: 1, d: 1, n: 0, s: 0, w: 0, e: 1},		// Red Camp - Mine - Pangloss

				2: {type: 2, timer: 1, d: 1, n: 0, s: 1, w: 0, e: 1},		// Blue Keep - Valley
				15: {type: 3, timer: 1, d: 1, n: 0, s: 1, w: 1, e: 0},	// Blue Tower - Langor Gulch
				22: {type: 3, timer: 1, d: 1, n: 0, s: 1, w: 0, e: 1},	// Blue Tower - Bravost Escarpment
				16: {type: 3, timer: 1, d: 1, n: 1, s: 0, w: 1, e: 0},	// Blue Tower - Quentin Lake
				21: {type: 3, timer: 1, d: 1, n: 1, s: 0, w: 0, e: 1},	// Blue Tower - Durios Gulch
				7: {type: 4, timer: 1, d: 1, n: 0, s: 1, w: 0, e: 0},		// Blue Camp - Mine - Danelon
				8: {type: 4, timer: 1, d: 1, n: 0, s: 0, w: 0, e: 1},		// Blue Camp - Mill - Umberglade

				3: {type: 2, timer: 1, d: 1, n: 1, s: 0, w: 0, e: 0},		// Green Keep - Lowlands
				11: {type: 3, timer: 1, d: 1, n: 0, s: 1, w: 1, e: 0},	// Green Tower - Aldons
				13: {type: 3, timer: 1, d: 1, n: 0, s: 1, w: 0, e: 1},	// Green Tower - Jerrifer's Slough
				12: {type: 3, timer: 1, d: 1, n: 1, s: 0, w: 1, e: 0},	// Green Tower - Wildcreek
				14: {type: 3, timer: 1, d: 1, n: 1, s: 0, w: 0, e: 1},	// Green Tower - Klovan Gully
				10: {type: 4, timer: 1, d: 1, n: 1, s: 0, w: 0, e: 0},	// Green Camp - Mine - Rogues Quarry
				4: {type: 4, timer: 1, d: 1, n: 0, s: 0, w: 0, e: 1},		// Green Camp - Mill - Golanta

				//	BlueHome
				23: {type: 2, timer: 1, d: 1, n: 1, s: 0, w: 0, e: 0},	// Garrison
				27: {type: 2, timer: 1, d: 1, n: 0, s: 0, w: 1, e: 0},	// Bay - Ascension Bay
				31: {type: 2, timer: 1, d: 1, n: 0, s: 0, w: 0, e: 1},	// Hills - Askalion Hills
				30: {type: 3, timer: 1, d: 1, n: 1, s: 0, w: 1, e: 0},	// NW Tower - Woodhaven
				28: {type: 3, timer: 1, d: 1, n: 1, s: 0, w: 0, e: 1},	// NE Tower - Dawn's Eyrie
				29: {type: 4, timer: 1, d: 1, n: 1, s: 0, w: 0, e: 0},	// North Camp - Crossroads - The Spiritholme
				58: {type: 4, timer: 1, d: 1, n: 1, s: 0, w: 1, e: 0},	// NW Camp - Mine - Godslore
				60: {type: 4, timer: 1, d: 1, n: 1, s: 0, w: 0, e: 1},	// NE Camp - Mill - Stargrove

				25: {type: 3, timer: 1, d: 1, n: 0, s: 1, w: 1, e: 0},	// SW Tower - Redbriar
				26: {type: 3, timer: 1, d: 1, n: 0, s: 1, w: 0, e: 1},	// SE Tower - Greenlake
				24: {type: 4, timer: 1, d: 1, n: 0, s: 1, w: 0, e: 0},	// South Camp - Orchard - Champion's Demense
				59: {type: 4, timer: 1, d: 1, n: 0, s: 1, w: 1, e: 0},	// SW Camp - Workshop - Redvale Refuge
				61: {type: 4, timer: 1, d: 1, n: 0, s: 1, w: 0, e: 1},	// SE Camp - Fishing Village - Greenwater Lowlands

				//	RedHome
				37: {type: 2, timer: 1, d: 1, n: 1, s: 0, w: 0, e: 0},	// Garrison
				33: {type: 2, timer: 1, d: 1, n: 0, s: 0, w: 1, e: 0},	// Bay - Dreaming Bay
				32: {type: 2, timer: 1, d: 1, n: 0, s: 0, w: 0, e: 1},	// Hills - Etheron Hills
				38: {type: 3, timer: 1, d: 1, n: 1, s: 0, w: 1, e: 0},	// NW Tower - Longview
				40: {type: 3, timer: 1, d: 1, n: 1, s: 0, w: 0, e: 1},	// NE Tower - Cliffside
				39: {type: 4, timer: 1, d: 1, n: 1, s: 0, w: 0, e: 0},	// North Camp - Crossroads - The Godsword
				52: {type: 4, timer: 1, d: 1, n: 1, s: 0, w: 1, e: 0},	// NW Camp - Mine - Arah's Hope
				51: {type: 4, timer: 1, d: 1, n: 1, s: 0, w: 0, e: 1},	// NE Camp - Mill - Astralholme

				35: {type: 3, timer: 1, d: 1, n: 0, s: 1, w: 1, e: 0},	// SW Tower - Greenbriar
				36: {type: 3, timer: 1, d: 1, n: 0, s: 1, w: 0, e: 1},	// SE Tower - Bluelake
				34: {type: 4, timer: 1, d: 1, n: 0, s: 1, w: 0, e: 0},	// South Camp - Orchard - Victor's Lodge
				53: {type: 4, timer: 1, d: 1, n: 0, s: 1, w: 1, e: 0},	// SW Camp - Workshop - Greenvale Refuge
				50: {type: 4, timer: 1, d: 1, n: 0, s: 1, w: 0, e: 1},	// SE Camp - Fishing Village - Bluewater Lowlands

				//	GreenHome
				46: {type: 2, timer: 1, d: 1, n: 1, s: 0, w: 0, e: 0},	// Garrison
				44: {type: 2, timer: 1, d: 1, n: 0, s: 0, w: 1, e: 0},	// Bay - Dreadfall Bay
				41: {type: 2, timer: 1, d: 1, n: 0, s: 0, w: 0, e: 1},	// Hills - Shadaran Hills
				47: {type: 3, timer: 1, d: 1, n: 1, s: 0, w: 1, e: 0},	// NW Tower - Sunnyhill
				57: {type: 3, timer: 1, d: 1, n: 1, s: 0, w: 0, e: 1},	// NE Tower - Cragtop
				56: {type: 4, timer: 1, d: 1, n: 1, s: 0, w: 0, e: 0},	// North Camp - Crossroads - The Titanpaw
				48: {type: 4, timer: 1, d: 1, n: 1, s: 0, w: 1, e: 0},	// NW Camp - Mine - Faithleap
				54: {type: 4, timer: 1, d: 1, n: 1, s: 0, w: 0, e: 1},	// NE Camp - Mill - Foghaven

				45: {type: 3, timer: 1, d: 1, n: 0, s: 1, w: 1, e: 0},	// SW Tower - Bluebriar
				42: {type: 3, timer: 1, d: 1, n: 0, s: 1, w: 0, e: 1},	// SE Tower - Redlake
				43: {type: 4, timer: 1, d: 1, n: 0, s: 1, w: 0, e: 0},	// South Camp - Orchard - Hero's Lodge
				49: {type: 4, timer: 1, d: 1, n: 0, s: 1, w: 1, e: 0},	// SW Camp - Workshop - Bluevale Refuge
				55: {type: 4, timer: 1, d: 1, n: 0, s: 1, w: 0, e: 1},	// SE Camp - Fishing Village - Redwater Lowlands
			},

			objectiveGroups: [
				{
					mapType: 'Center',
					sortIndex: 0,
					mapIndex: 3,
					sections: [{
							label: 'Castle',
							groupType: 'neutral',
							objectives: [9], 								// sm
						}, {
							label: 'Red Corner',
							groupType: 'red',
							objectives: [1, 17, 20, 18, 19, 6, 5],			// overlook, mendons, veloka, anz, ogre, speldan, pang
						}, {
							label: 'Blue Corner',
							groupType: 'blue',
							objectives: [2, 15, 22, 16, 21, 7, 8]			// valley, langor, bravost, quentin, durios, dane, umber
						}, {
							label: 'Green Corner',
							groupType: 'green',
							objectives: [3, 11, 13, 12, 14, 10, 4] 			// lowlands, aldons, jerrifer, wildcreek, klovan, rogues, golanta
						},],
				},

				{
					mapType: 'RedHome',
					sortIndex: 1,
					mapIndex: 0,
					sections: [{
							label: 'North',
							groupType: 'red',
							objectives: [37, 33, 32, 38, 40, 39, 52, 51] 	// keep, bay, hills, longview, cliffside, godsword, hopes, astral
						}, {
							label: 'South',
							groupType: 'neutral',
							objectives: [35, 36, 34, 53, 50] 				// briar, lake, lodge, vale, water
						// }, {
						// 	label: 'Ruins',
						// 	groupType: 'ruins',
						// 	objectives: [62, 63, 64, 65, 66] 				// temple, hollow, estate, orchard, ascent
						},],
				},

				{
					mapType: 'BlueHome',
					sortIndex: 2,
					mapIndex: 1,
					sections: [{
							label: 'North',
							groupType: 'blue',
							objectives: [23, 27, 31, 30, 28, 29, 58, 60] 	// keep, bay, hills, woodhaven, dawns, spirit, gods, star
						}, {
							label: 'South',
							groupType: 'neutral',
							objectives: [25, 26, 24, 59, 61] 				// briar, lake, champ, vale, water
						// }, {
						// 	label: 'Ruins',
						// 	groupType: 'ruins',
						// 	objectives: [71, 70, 69, 68, 67] 				// temple, hollow, estate, orchard, ascent
						},],
				},

				{
					mapType: 'GreenHome',
					sortIndex: 3,
					mapIndex: 2,
					sections: [{
							label: 'North',
							groupType: 'green',
							objectives: [46, 44, 41, 47, 57, 56, 48, 54] 	// keep, bay, hills, sunny, crag, titan, faith, fog
						}, {
							label: 'South',
							groupType: 'neutral',
							objectives: [45, 42, 43, 49, 55] 				// briar, lake, lodge, vale, water
						// }, {
						// 	label: 'Ruins',
						// 	groupType: 'ruins',
						// 	objectives: [76 , 75 , 74 , 73 , 72 ] 			// temple, hollow, estate, orchard, ascent
						},]
				},
			],
			mapObjectives: {}, // set by setMapObjectives() auto execute;
		},
	};


	(function setMapObjectives() {
		angular.forEach(
			svc.wvw.objectiveGroups,
			function(group) {

				var mapName = group.mapType;

				angular.forEach(group.sections, function(section) {

					var sectionName = section.label;

					angular.forEach(section.objectives, function(objectiveId) {

						svc.wvw.mapObjectives[objectiveId] = {
							mapName: mapName,
							sectionName: sectionName,
						};

					});

				});
			}
		);
	})();


	/*
	*	Private Properties
	*/

	var __INSTANCE = {
		objectiveTypeLookup: {
			"castle": svc.wvw.objectiveTypes[1],
			"schloss": svc.wvw.objectiveTypes[1],
			"château": svc.wvw.objectiveTypes[1],
			"castillo": svc.wvw.objectiveTypes[1],

			"keep": svc.wvw.objectiveTypes[2],
			"feste": svc.wvw.objectiveTypes[2],
			"fort": svc.wvw.objectiveTypes[2],
			"fortaleza": svc.wvw.objectiveTypes[2],

			"tower": svc.wvw.objectiveTypes[3],
			"turm": svc.wvw.objectiveTypes[3],
			"tour": svc.wvw.objectiveTypes[3],
			"torre": svc.wvw.objectiveTypes[3],

			// 4 = camp = default

			"((temple of lost prayers))": svc.wvw.objectiveTypes[5],
			"((battle's hollow))": svc.wvw.objectiveTypes[6],
			"((bauer's estate))": svc.wvw.objectiveTypes[7],
			"((orchard overlook))": svc.wvw.objectiveTypes[8],
			"((carver's ascent))": svc.wvw.objectiveTypes[9],
		}
	};



	/*
	*
	*	Public Methods
	*
	*/


	/*
	*	Lang
	*/

	svc.isValidLang = function isValidLang(lang) {
		return _.some(svc.langs, {slug: lang});
	};

	svc.getLang = _.memoize(function(langKey) {
		return _.find(svc.langs, {'slug': langKey});
	});




	/*
	*	wvw objectives
	*/

	svc.getObjectiveType = function getObjectiveType(genericName) {
		return __INSTANCE.objectiveTypeLookup[genericName.toLowerCase()] || svc.wvw.objectiveTypes[4];
	};


	/*
	*	wvw worlds
	*/

	svc.getWorldsConfig = function getWorldsConfig() {
		return svc.wvw.worldsConfig;
	};



	svc.getRegion = function getRegion(id) {
		if (parseInt(id.toString().charAt(0)) === 2) {
			return 'EU';
		}
		else {
			return 'NA';
		}
	};



	return svc;
}]);
