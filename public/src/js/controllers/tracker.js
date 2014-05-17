
/*!
 *
 *	Controllers - TrackerCtrl
 *
 !*/

angular.module('gw2app').controller('TrackerCtrl', [
	'$scope',
	'$anchorScroll',
	'$window',
	'$interval',
	'$timeout',

	'GW2Svc',
	'i18nSvc',
function(
	$scope,
	$anchorScroll,
	$window,
	$interval,
	$timeout,

	GW2Svc,
	i18nSvc
) {
	'use strict';

	console.log('\nAPP MODE :: Tracker\n');


	var matchDetailsTimeoutPriority = 1; // 2-4


	/*
	*	PUBLIC METHODS
	*/



	$scope.gotoGuild = function(guildId) {
		$location.hash(guildId);
		$anchorScroll();
	};


	$scope.highlightObjective = function(objectiveId) {
		$('#objective' + objectiveId).addClass('highlight');
	};

	$scope.deHighlightObjective = function(objectiveId) {
		$('#objective' + objectiveId).removeClass('highlight');
	};

	$scope.getDirectionArrow = function(objectiveId) {
		var meta = $scope.gw2.wvw.objectiveMeta[objectiveId];
		var src = ['/dist/img/min/arrow'];

		if (meta.n) {
			src.push('north');
		}
		else if (meta.s) {
			src.push('south');
		}

		if (meta.w) {
			src.push('west');
		}
		else if (meta.e) {
			src.push('east');
		}

		return src.join('-');
	};


	/*
	*	INIT
	*/

	$scope.$on('appInit', function() {
		console.log('TrackerCtrl Starting');

		async.auto({
			'setActiveMatch': __setActiveMatch,
			'setMatchWorlds': __setMatchWorlds,
			'setObjectives': __setObjectives,

			'initScope': ['setActiveMatch', __initScope],
			'setPageTitle': ['setActiveMatch', __setPageTitle],


			'getMatchDetails': ['initScope', function(callback) {
				$scope.getMatchDetails(
					matchDetailsTimeoutPriority,
					$scope.active.matchId,
					callback
				);
			}],

			'watchMatchDetails': ['getMatchDetails', function(callback) {
				 $scope.$watch('active.matchDetails', __matchDetailsWatcher);
				 callback();
			}],
		},
		function() {
			console.log('TrackerCtrl Ready');

			__watchMatchDetails();
		});
	});





	/*
	*	WATCHERS
	*/

	function __watchMatchDetails() {
		$scope.$watch(
			function() {return $scope.matchDetails[$scope.active.matchId]},
			function(newVal, oldVal) {
				$scope.active.matchDetails = newVal;
				// console.log('new match details');
			}
		);

	}


	/*
	*	PRIVATE METHODS
	*/

	function __setActiveMatch(callback) {
		// console.log('__setActiveMatch()')
		var worldId = $scope.active.world.id;


		async.detect(
			$scope.matches,
			function(match, isMatch) {
				isMatch(
					match.blue_world_id === worldId
					|| match.green_world_id === worldId
					|| match.red_world_id === worldId
				);
			},
			function(activeMatch) {
				if ($scope.matchId) {
					$scope.prevMatchId = $scope.matchId;
				}

				$scope.active.match = activeMatch;
				$scope.active.matchId = activeMatch.wvw_match_id;
				$scope.matchId = activeMatch.wvw_match_id;
				// console.log($scope.active);



				// console.log('Active Match', $scope.active.match);


				callback();
			}
		);
	}


	function __initScope(callback) {
		$scope.logFilters = {
			map: 'all',
			captures: true,
			claims: true,
		};
		$scope.moment = $window.moment;

		$scope.timersAccurate = false;
		__waitForAccurateTimers();

		__setupAudio();
		__initHoldings();

		$scope.mapNamesByType = {
			'Center': 'Eternal Battlegrounds',
			'RedHome': $scope.matchWorldsByColor.red[$scope.active.lang.slug].name,
			'BlueHome': $scope.matchWorldsByColor.blue[$scope.active.lang.slug].name,
			'GreenHome': $scope.matchWorldsByColor.green[$scope.active.lang.slug].name,
		};

		// $scope.objectives = {};
		$scope.state = {};
		$scope.guilds = {};
		$scope.timeline = [];
		$scope.matchGuilds = {};


		// console.log('Scope Inited');

		callback();
	}


	function __setPageTitle(callback) {
		var pageTitle = [
			$scope.active.world.name,
			'@',
			'GuildWars2 WvW',
			i18nSvc["liveScores"][$scope.active.lang.slug],
		];

		if ($scope.active.lang.slug !== 'en') {
			pageTitle.push('(' + $scope.active.lang.name + ')');
		}

		$scope.setPageTitle(pageTitle.join(' '), callback);
	}



	function __setMatchWorlds(callback) {
		$scope.matchWorlds = [
			$scope.worldsById[$scope.active.match.red_world_id],
			$scope.worldsById[$scope.active.match.blue_world_id],
			$scope.worldsById[$scope.active.match.green_world_id],
		];
		$scope.matchWorldsByColor = {
			'red': $scope.worldsById[$scope.active.match.red_world_id],
			'blue': $scope.worldsById[$scope.active.match.blue_world_id],
			'green': $scope.worldsById[$scope.active.match.green_world_id],
		};

		callback();
	}




	/*
	*
	*	Holdings
	*
	*/

	function __initHoldings() {
		var holdingsTemplate = {
			castles: 0,
			keeps: 0,
			towers: 0,
			camps: 0,
			tick: 0,
		};
		$scope.holdings = {
			'red': _.clone(holdingsTemplate),
			'blue': _.clone(holdingsTemplate),
			'green': _.clone(holdingsTemplate),
		};
	}

	function __updateHoldings(newMD, oldMD, callback) {
		if (newMD && !angular.equals(newMD, oldMD)) {
			var objectives = __getObjectivesFromDetails(newMD);

			__initHoldings();

			_.each(objectives, function(o) {
				var meta = $scope.gw2.wvw.objectiveMeta[o.id];
				if (meta) {
					var type = $scope.gw2.wvw.objectiveTypes[meta.type];
					var teamColor = o.owner.toLowerCase();

					if (meta.type === 1) {
						$scope.holdings[teamColor].castles++;
					}
					else if (meta.type === 2) {
						$scope.holdings[teamColor].keeps++;
					}
					else if (meta.type === 3) {
						$scope.holdings[teamColor].towers++;
					}
					else if (meta.type === 4) {
						$scope.holdings[teamColor].camps++;
					}
					$scope.holdings[teamColor].tick += type.value;
				}
			});

		}
		callback();
	}




	/*
	*
	*	Audio
	*
	*/

	function __setupAudio() {
		var chirp = document.createElement('audio');
        chirp.setAttribute('src', '/dist/audio/beep-27.mp3');

        $scope.audioEnabled = false;
        $scope.toggleAudio = function() {
        	$scope.audioEnabled = !$scope.audioEnabled;
        };

		$scope.playNotificationSound = _.throttle(function() {
			$scope.audioEnabled && chirp.play();
		}, 500);
	}





	/*
	*
	*	Match Details
	*
	*/

	function __matchDetailsWatcher(newMD, oldMD) {
		async.parallel([
			__setGuilds.bind(null, newMD),
			__determineMatchState.bind(null, newMD, oldMD),
			__updateHoldings.bind(null, newMD, oldMD),
		]);
	}




	/*
	*
	*	Objectives
	*
	*/

	function __setObjectives(callback) {
		$scope.objectives = GW2Svc.data.wvw.objectives;
		// GW2Svc.getObjectives(function(err, objectives) {
		// 	$scope.objectives = objectives;
		// 	callback();
		// });
		callback();
	}



	function __getObjectivesFromDetails(md) {
		var tmpObjectives = _.flatten(_.pluck(md.maps, 'objectives'));
		var objectives = {};
		angular.forEach(tmpObjectives, function(objective) {
			objectives[objective.id] = objective;
		});

		return objectives;
	}




	/*
	*
	*	Match State
	*
	*/

	function __determineMatchState(newMD, oldMD, callback) {
		if (!newMD && !oldMD) {
			callback();
		}
		$scope.matchStateIntialized = $scope.matchStateIntialized || false;
		if (newMD && !oldMD && !$scope.matchStateIntialized) {
			$scope.matchStateIntialized = true;
			__initState(newMD, callback);
		}
		if (newMD && oldMD) {
			__updateStateThrottled(newMD, oldMD, callback);
		}
	}


	function __initState(newMD, callback) {
		// console.log('__initState');
		var now = roundToSecond($scope.initTime);

		var mdObjectives = __getObjectivesFromDetails(newMD);
		angular.forEach(mdObjectives, function(mdObjective) {
			// now = _.random(dateSeconds() - 1000 * 60 * 10, dateSeconds());
			// now = Math.round(now / 1000) * 1000
			mdObjective.initTime = now;
			mdObjective.lastCaptured = mdObjective.initTime;

			// mdObjective.buffRemaining = (mdObjective.lastCaptured + 1000 * 60 * 5);
			// __appendToTimeline(mdObjective.lastCaptured, 'newOwner', mdObjective);

			if (mdObjective.owner_guild) {
				mdObjective.lastClaimed = now;
				// __appendToTimeline(now, 'newClaimer', mdObjective);
				__updateMatchGuild(mdObjective.lastCaptured, mdObjective.owner_guild, mdObjective.id);
			}
			else if ($scope.objectives[mdObjective.id] && $scope.objectives[mdObjective.id].guild) {
				delete $scope.objectives[mdObjective.id].guild;
			}

			
			$scope.state[mdObjective.id] = mdObjective;
		});


		callback();
	}



	function __updateState(newMD, oldMD, callback) {
		var newObjs = __getObjectivesFromDetails(newMD);
		var oldObjs = __getObjectivesFromDetails(oldMD);

		var now = dateSeconds();

		// console.log('__updateState');

		angular.forEach($scope.objectives, function(obj) {

			if (obj.meta && obj.meta.timer) {
				var state = $scope.state[obj.id];

				var oldObj = oldObjs[obj.id];
				var newObj = newObjs[obj.id];

				var ownerChanged = (oldObj.owner !== newObj.owner);
				var claimerChanged = (oldObj.owner_guild !== newObj.owner_guild);
				var hasClaimer = !!newObj.owner_guild;



				if (ownerChanged || claimerChanged) {
					var commonName = obj.name[$scope.active.lang.slug];

					if (ownerChanged) {
						// console.log(now, 'newOwner');
						state.owner = newObj.owner;
						state.prevOwner = oldObj.owner;
						state.lastCaptured = now;
						// state.buffRemaining = (state.lastCaptured + 1000 * 60 * 5);
						delete state.owner_guild;

						__appendToTimeline(now, 'newOwner', newObj);
					}
					if (claimerChanged) {
						state.owner_guild = newObj.owner_guild;

						if (hasClaimer) {
							// console.log(now, 'newClaimer');
							state.lastClaimed = now;
							__appendToTimeline(now, 'newClaimer', newObj);
							__updateMatchGuild(now, newObj.owner_guild, newObj.id);
						}
						else {
							// console.log(now, '************ dropClaimer');
						}
					}

					$scope.playNotificationSound();

					// console.log(now, commonName, state, oldObj, newObj);
				}

			}

		});

		callback();
	}

	var __updateStateThrottled = _.throttle(__updateState, 250);




	/*
	*
	*	Guilds
	*
	*/


	function __setGuilds(newMD, callback) {
		if (newMD) {
			var objectives = __getObjectivesFromDetails(newMD);

			var mdGuilds = _.pluck(objectives, 'owner_guild');
			mdGuilds = _.without(_.uniq(mdGuilds), undefined);

			var knownGuilds = Object.keys($scope.guilds);
			var guildsToLookup = _.difference(mdGuilds, knownGuilds);

			// console.log('knownGuilds', knownGuilds);
			// console.log('guildsToLookup', guildsToLookup);

			async.each(
				guildsToLookup,
				__setGuild,
				callback
			);

		}
		else {
			callback();
		}
	}


	function __setGuild(guildId, callback) {
		GW2Svc.getGuildDetails(guildId, function(err, guild) {
			$scope.guilds[guildId] = guild;

			// angular.forEach($scope.objectives, function(o) {
			// 	var state = $scope.state[o.id];
			// 	if (state.owner_guild && state.owner_guild === guildId){
			// 		o.guild = guild;
			// 	}
			// });
			callback();
		});
	}


	function __updateMatchGuild(timestamp, guildId, objectiveId) {
		var matchId = $scope.active.match.wvw_match_id;
		var matchGuilds = $scope.matchGuilds[matchId] = $scope.matchGuilds[matchId] || {};

		if (!matchGuilds[guildId]) {
			matchGuilds[guildId] = {
				id: guildId,
				claims: [],
				latestClaim: timestamp,
			};
		}

		matchGuilds[guildId].claims.push({
			id: objectiveId,
			timestamp: timestamp,
		});

		angular.forEach(matchGuilds[guildId].claims, function(claim) {
			matchGuilds[guildId].latestClaim = Math.max(matchGuilds[guildId].latestClaim, claim.timestamp);
		});
		matchGuilds[guildId].latestClaimText = moment(matchGuilds[guildId].latestClaim).format("dddd, MMMM Do YYYY, h:mm:ss a");
	}







	/*
	*
	*	Log / Timeline
	*
	*/

	var timelineMaxSize = 50;
	function __appendToTimeline(timestamp, type, objective) {
		var objCloned = _.cloneDeep(objective);


		$scope.timeline.push({
			type: type,
			objective: objCloned,
			timestamp: timestamp,
		});


		if ($scope.timeline.length >= timelineMaxSize) {
			$scope.timeline.shift();
		}

	}




	/*
	*
	*	Time & Timers
	*
	*/

	function __updateTimers() {
		async.parallel([
			// __updateBuffTimers,
			__updateTwitterMoments,
		], angular.noop);
	};

	$scope.intervals['__updateTimers'] = $interval(__updateTimers, 1000);


	// function __updateBuffTimers(callback) {
	// 	var now = dateSeconds();

	// 	// angular.forEach(
	// 	// 	$scope.objectives,
	// 	// 	function(objective) {
	// 	// 		if (objective) {
	// 	// 			var useTimer = objective.type.timer;
	// 	// 			if (useTimer && objective.state.buffRemaining) {
	// 	// 				objective.state.buffRemaining = (objective.state.lastCaptured + 1000 * 60 * 5) - now;
	// 	// 				if (objective.state.buffRemaining <= 0) {
	// 	// 					delete objective.state.buffRemaining;
	// 	// 				}
	// 	// 			}
	// 	// 		}
	// 	// 	}
	// 	// );
	// 	callback();
	// }


	function __updateTwitterMoments(callback) {
		var $moments = $('.objective .moment span');
		if ($scope.timeline && $scope.timeline.length) {
			async.each(
				$moments,
				function(_moment, next) {
					
					var $moment = $(_moment);
					var timestamp = $moment.data('timestamp');
					$moment.text(moment(timestamp).twitter());

					next(null);
				},
				callback
			);
		}
		else {
			callback();
		}
	}


	function __waitForAccurateTimers() {
		var msSinceInit = (Date.now() - $scope.initTime);
		var expired = msSinceInit > 1000 * 60 * 5;
		if (expired) {
			// console.log('Timers now accurate');
			$scope.timersAccurate = true;
		}
		else {
			$scope.timers['__waitForAccurateTimers'] = $timeout(__waitForAccurateTimers, 1000);
		}

	}



	function dateSeconds() {
		// nearest second so that buff timers update at the same time
		return roundToSecond(Date.now());
	}

	function roundToSecond(msDate) {
		return Math.round(msDate / 1000) * 1000;
	}

}]);
