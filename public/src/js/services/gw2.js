
/*!
*
* Services - GW2Svc
*
!*/

angular.module('gw2app').service('GW2Svc', [
	'$rootScope',

	'LocalStorageSvc',
	'MemCacheSvc',
	'GW2DataSvc',
	'GW2ApiSvc',

function(
	$rootScope,

	LocalStorageSvc,
	MemCacheSvc,
	GW2DataSvc,
	GW2ApiSvc
) {
	// 'use strict';

	console.log('********************');
	console.log('GW2Svc Invoked');
	console.log('GW2DataSvc', GW2DataSvc);
	console.log('GW2ApiSvc', GW2ApiSvc);
	console.log('********************');


	/*
	*
	*  EXPORT
	*
	*/

	var svc = {};



	/*
	*
	*  PUBLIC PROPERTIES
	*
	*/

	svc.data = GW2DataSvc;
	// svc.api = GW2ApiSvc;



	/*
	*
	*  PRIVATE PROPERTIES
	*
	*/

	var __INSTANCE = {};

	$rootScope.inProgress = $rootScope.inProgress || {};





	/*
	*
	*  WORLDS :: PUBLIC METHODS
	*
	*/

	svc.initWorldData = function(onInit) {
		console.log('initWorldData()');
		async.series([
			svc.getWorlds,
			svc.getWorldsById,
		], function() {
			console.log('initWorldData() complete');
			onInit();
		});
	};


	svc.getWorlds = function(onGet) {
		var cacheKey = 'worlds';

		LocalStorageSvc.get(cacheKey, function(data) {
			if (data) {
				// console.log('cache hit:', cacheKey);
				onGet(null, data);
			}
			else {
				// console.log('cache miss:', cacheKey);
				if (angular.isDefined($rootScope.inProgress[cacheKey])) {
					// console.log('Remote get in progress, rescheduling: ', cacheKey);
					setTimeout(svc.getWorlds.bind(null, onGet), 100);
				}
				else {
					__getWorldsRemote(cacheKey, onGet);
				}
			}

		});
	};


	svc.getWorldsById = function(onGet) {
		var cacheKey = 'worldsById';

		MemCacheSvc.get(cacheKey, function(err, data) {
			if (data) {
				// console.log('cache hit:', cacheKey);
				onGet(null, data);
			}
			else {
				// console.log('cache miss:', cacheKey);
				if (angular.isDefined($rootScope.inProgress[cacheKey])) {
					// console.log('Remote get in progress, rescheduling: ', cacheKey);
					setTimeout(svc.getWorldsById.bind(null, onGet), 100);
				}
				else {
					__generateWorldsById(
						cacheKey,
						onGet
					);
				}
			}
		});
	};


	svc.getWorldsByLang = function(langKey, onGet) {
		svc.getWorlds(function(err, worlds) {
			onGet(null, worlds[langKey]);
		});
	};


	svc.getWorldById = function(id, onGet) {
		svc.getWorldsById(function(err, worldsById) {
			onGet(null, worldsById[id]);
		});
	};


	svc.getWorldBySlug = function(worldSlug, langKey, onGet) {
		svc.getWorldsByLang(langKey, function(err, worldsByLang) {
			async.detect(
				worldsByLang,
				function(world, isMatch) {
					isMatch(world.slug === worldSlug);
				},
				onGet.bind(null, null)
			);
		});
	};



	/*
	*
	*  WORLDS :: PRIVATE METHODS
	*
	*/

	function __getWorldsRemote(cacheKey, onDone) {
		var cacheTime = 1000 * 60 * 60; // 1 hour

		var tmpWorlds = {};
		$rootScope.inProgress[cacheKey] = true;

		async.each(
			svc.data.langs,
			function(lang, nextLang) {
				GW2ApiSvc.getWorlds({lang: lang.slug}, function(err, worldsByLang) {
					tmpWorlds[lang.slug] = worldsByLang;
					nextLang();
				});
			},
			function() {
				delete $rootScope.inProgress[cacheKey];

				LocalStorageSvc.put(
					cacheKey,
					tmpWorlds,
					cacheTime,
					svc.getWorlds.bind(null, onDone)
				);

			}
		);
	}


	function __generateWorldsById(cacheKey, onDone) {
		var cacheTime = null;
		var onExpire = null;

		var tmpWorldsById = {};
		$rootScope.inProgress[cacheKey] = true;

		svc.getWorlds(function(err, worlds) {

			async.each(
				Object.keys(worlds),
				function(langKey, nextLang) {
					// console.log(langKey)

					async.each(
						worlds[langKey],
						function(world, nextWorld) {
							// console.log(world);
							tmpWorldsById[world.id] = tmpWorldsById[world.id] || {id: world.id};
							tmpWorldsById[world.id][langKey] = world;

							nextWorld();
						},
						nextLang
					);

				},
				function() {
					delete $rootScope.inProgress[cacheKey];

					MemCacheSvc.put(
						cacheKey,
						tmpWorldsById,
						cacheTime,
						onExpire,
						svc.getWorldsById.bind(null, onDone)
					);
				}
			);

		});

	}





	/*
	*
	*  OBJECTIVES :: PUBLIC METHODS
	*
	*/


	svc.getObjectives = function(onGet) {
		var cacheKey = 'objectives';

		LocalStorageSvc.get(cacheKey, function(data) {
			if (data) {
				// console.log('cache hit:', cacheKey);
				onGet(null, data);
			}
			else {
				// console.log('cache miss:', cacheKey);
				if (angular.isDefined($rootScope.inProgress[cacheKey])) {
					// console.log('Remote get in progress, rescheduling: ', cacheKey);
					setTimeout(svc.getObjectives.bind(null, onGet), 100);
				}
				else {
					__getObjectivesRemote(cacheKey, onGet);
				}
			}

		});
	};



	/*
	*
	*  OBJECTIVES :: PRIVATE METHODS
	*
	*/

	function __getObjectivesRemote(cacheKey, onDone) {
		var cacheTime = 1000 * 60 * 60; // 1 hour
		var tmpObjectives = {};

		$rootScope.inProgress[cacheKey] = true;
		GW2ApiSvc.getObjectives({}, function(err, tmpObjectives) {

			var objectives = {};
			async.each(
				tmpObjectives,
				function(objective, nextObjective) {
					objective.id = parseInt(objective.id);
					objective.type = svc.data.getObjectiveType(objective.name);

					tmpObjectives[objectives.id] = objective;
					nextObjective();
				},
				function(err) {

					delete $rootScope.inProgress[cacheKey];

					LocalStorageSvc.put(
						cacheKey,
						tmpObjectives,
						cacheTime,
						svc.getObjectives.bind(null, onDone)
					);
				}
			);

		});
	}





	/*
	*
	*  MATCHES :: PUBLIC METHODS
	*
	*/

	svc.getMatches = function(onGet) {
		var cacheKey = 'matches';

		MemCacheSvc.get(cacheKey, function(err, data) {
			if (data) {
				// console.log('cache hit:', cacheKey);
				onGet(null, data);
			}
			else {
				// console.log('cache miss:', cacheKey);

				if (angular.isDefined($rootScope.inProgress[cacheKey])) {
					setTimeout(svc.getMatches.bind(null, onGet), 100);
				}
				else {
					__getMatchesRemote(cacheKey, onGet);
				}
			}

		});
	};


	svc.getNextMatchReset = function(matches, callback) {
		var endTimes = _.pluck(matches, 'end_time');

		var msTimes = _.map(endTimes, function(time) {
			return Date.parse(time);
		});

		var nextReset = Math.min.apply(Math, msTimes);

		callback(nextReset);
	};



	/*
	*
	*  MATCHES :: PRIVATE METHODS
	*
	*/


	function __getMatchesRemote(cacheKey, onDone) {
		var cacheTime = 1000 * 4; // 4 seconds
		var onExpire = null;

		$rootScope.inProgress[cacheKey] = true;

		GW2ApiSvc.getMatches({}, function(err, matches) {
			delete $rootScope.inProgress[cacheKey];

			MemCacheSvc.put(
				cacheKey,
				matches,
				cacheTime,
				onExpire,
				svc.getMatches.bind(null, onDone)
			);
		});
	}





	/*
	*
	*  MATCH DETAILS :: PUBLIC METHODS
	*
	*/

	svc.getMatchDetails = function(matchId, onGet) {
		var cacheKey = 'matchDetails' + matchId;

		MemCacheSvc.get(cacheKey, function(err, data) {
			if (data) {
				// console.log('cache hit:', cacheKey);
				onGet(null, data);
			}
			else {
				// console.log('cache miss:', cacheKey);

				if (angular.isDefined($rootScope.inProgress[cacheKey])) {
					setTimeout(svc.getMatchDetails.bind(null, matchId, onGet), 100);
				}
				else {
					__getMatchDetailsRemote(matchId, cacheKey, onGet);
				}
			}

		});
	};



	/*
	*
	*  MATCHES DETAILS :: PRIVATE METHODS
	*
	*/


	function __getMatchDetailsRemote(matchId, cacheKey, onDone) {
		var cacheTime = 1000 * 2; // 2 seconds
		var onExpire = null;

		$rootScope.inProgress[cacheKey] = true;

		GW2ApiSvc.getMatchDetails({matchId: matchId}, function(err, matches) {
			delete $rootScope.inProgress[cacheKey];

			// console.log('__getMatchDetailsRemote done', matchId);

			MemCacheSvc.put(
				cacheKey,
				matches,
				cacheTime,
				onExpire,
				svc.getMatchDetails.bind(null, matchId, onDone)
			);
		});
	}





	/*
	*
	*  GUILDS :: PUBLIC METHODS
	*
	*/

	svc.getGuildDetails = function(guildId, onGet) {
		var cacheKey = ('guild-' + guildId);

		MemCacheSvc.get(cacheKey, function(err, data) {
			if (data) {
				// console.log('cache hit:', cacheKey);
				onGet(null, data);
			}
			else {
				// console.log('cache miss:', cacheKey);

				if (angular.isDefined($rootScope.inProgress[cacheKey])) {
					setTimeout(svc.getGuildDetails.bind(null, onGet), 100);
				}
				else {
					__getGuildDetailsRemote(guildId, cacheKey, onGet);
				}
			}

		});
	};



	/*
	*
	*  MATCHES DETAILS :: PRIVATE METHODS
	*
	*/


	function __getGuildDetailsRemote(guildId, cacheKey, onDone) {
		var cacheTime = 1000 * 60 * 60; // 1 hour
		var onExpire = null;

		$rootScope.inProgress[cacheKey] = true;

		GW2ApiSvc.getGuildDetails({guild_id: guildId}, function(err, guild) {
			delete $rootScope.inProgress[cacheKey];

			MemCacheSvc.put(
				cacheKey,
				guild,
				cacheTime,
				onExpire,
				svc.getGuildDetails.bind(null, guildId, onDone)
			);
		});
	}



	return svc;
}]);
