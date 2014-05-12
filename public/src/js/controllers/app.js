
/*!
*
*	Controllers - App
*
!*/

angular.module('gw2app').controller('AppCtrl', [
	'$scope',
	'$rootScope',
	'$routeParams',
	'$location',
	'$timeout',
	'$interval',

	'GW2Svc',
function(
	$scope,
	$rootScope,
	$routeParams,
	$location,
	$timeout,
	$interval,

	GW2Svc
) {
	// 'use strict';




	/*
	*	PUBLIC METHODS
	*/

	$scope.getMatchDetails = function(timeoutPriority, matchId, callback) {
		var timeoutKey = ('matchDetails' + matchId);

		GW2Svc.getMatchDetails(matchId, function(err, matchDetails) {
			$scope.timers[timeoutKey] = $timeout(
				$scope.getMatchDetails.bind(null, timeoutPriority, matchId),
				$scope.getTimeout(timeoutPriority)
			);

			$scope.matchDetails[matchId] = matchDetails;
			$scope.scores[matchId] = matchDetails.scores;

			if (!$scope.$$phase) {
				$scope.$apply();
			}

			(callback || angular.noop)();
		});
	};


	$scope.getTimeout = function(priority) {
		var min = Math.pow(2, priority) * 1000;
		var max = Math.pow(2, priority + 1) * 1000;
		var timeout = _.random(min, max);

		return timeout;
	};


	$scope.timers = $scope.timers || {};
	$scope.intervals = $scope.intervals || {};
	$scope.$on("$destroy", function(event) {
		angular.forEach($scope.timers, function(timer, timerName) {
			$timeout.cancel(timer);
		});
		angular.forEach($scope.intervals, function(interval, intervalName) {
			$interval.cancel(interval);
		});
	});




	$scope.setPageTitle = function(pageTitle, callback) {
		$rootScope.pageTitle = pageTitle;

		callback();
	};


	$scope.requestsInProgress = _.throttle(function() {
		return !!Object.keys($rootScope.inProgress).length;
	}, 100);




	/*
	*	INIT APP
	*/

	(function init() {
		var that = this;

		console.log('AppCtrl Starting');

		async.auto({
			'initScope': __initScope,

			'initWorldData': __initWorldData,
			'initMatchData': ['initScope', __getMatches],

			'setActiveLang': __setActiveLang.bind(null, $routeParams),
			'setActiveWorld': ['initScope', 'initWorldData', 'setActiveLang', __setActiveWorld.bind(null, $routeParams)],


			'determineMode': ['setActiveWorld', __setAppMode.bind(null, $routeParams)],

		}, function(err, results) {
			if (!$scope.$$phase) {
				$scope.$apply();
			}

			console.log('AppCtrl Initialized');
			$scope.$broadcast('appInit');
		});


		return that;
	})();




	/*
	*
	*	PRIVATE METHODS
	*
	*/


	function __setAppMode($rp, callback) {
		// console.log('__setAppMode()');
		// console.log('$scope.active', $scope.active);


		if ($rp.lang && !$scope.active.lang) {
			// $scope.appMode = 'error';
			__error('Invalid Language:' + $rp.lang + '\nRedirecting to root', '/en', callback);
		}
		else if ($rp.worldSlug && !$scope.active.world) {
			// $scope.appMode = 'error';
			__error('Invalid World:' + $rp.worldSlug + '\nRedirecting to root', '/en', callback);
		}

		else {
			if ($scope.active.lang && $scope.active.world) {
				$scope.appMode = 'tracker';
				callback();
			}
			else if ($scope.active.lang) {
				$scope.appMode = 'overview';
				callback();
			}
			else {
				$scope.appMode = 'error';
				callback();
			}
		}
	}



	/*
	*	Scope Setters
	*/

	function __initScope(callback) {
		$scope.gw2 = {
			regions: GW2Svc.data.regions,
			langs: GW2Svc.data.langs,
			wvw: GW2Svc.data.wvw,
		};

		$scope.initTime = Date.now();

		$scope.active = $scope.active || {};
		$scope.matchDetails = $scope.matchDetails || {};
		$scope.scores = $scope.scores || {};
		$scope.scoreDiff = {};

		$scope.matchId = $scope.matchId || null;
		$scope.prevMatchId = $scope.prevMatchId || null;

		console.log('matchId', $scope.matchId);
		console.log('prevMatchId', $scope.prevMatchId);


		if (!$scope.$$phase) {
			$scope.$apply();
		}

		callback();
	}



	function __initWorldData(callback) {
		GW2Svc.initWorldData(function(err) {
			async.parallel([
				__setWorlds,
				__setWorldsById
			], function() {
				console.log('__initWorldData complete');
				callback();
			});
		});
	}

	function __setWorlds(callback) {
		// console.log('__setWorlds');
		GW2Svc.getWorlds(function(err, worlds) {
			$scope.worlds = worlds;
			// console.log('__setWorlds', worlds);
			callback();
		});
	}

	function __setWorldsById(callback) {
		// console.log('__setWorldsById');
		GW2Svc.getWorldsById(function(err, worldsById) {
			$scope.worldsById = worldsById;
			// console.log('__setWorldsById', worldsById);
			callback();
		});
	}

	function __getMatches(callback) {
		GW2Svc.getMatches(function(err, matches) {
			$scope.matches = matches;

			GW2Svc.getNextMatchReset(matches, function(nextReset) {
				var msToReset = nextReset - Date.now();
				var minToReset = Math.round(msToReset / 1000 / 60);
				console.log('Next reset in ', minToReset);

				var timeoutPriority = 8;
				if (msToReset < 512 * 1000) {
					timeoutPriority = 2;
					console.log('Reset Soon!!!', msToReset);
				}

				var thisTimeout = $scope.getTimeout(timeoutPriority);

				$scope.timers['matches'] = $timeout(__getMatches, thisTimeout);

				(callback || angular.noop)();
			});
		});
	}



	/*
	*	Actives
	*/

	function __setActiveLang($rp, callback) {
		$scope.active.lang = GW2Svc.data.getLang($rp.lang);

		console.log('$scope.active.lang', $scope.active.lang);

		callback();

	}

	function __setActiveWorld($rp, callback) {
		console.log('__setActiveWorld');
		if (angular.isDefined($rp.worldSlug) && angular.isDefined($scope.active.lang)) {
			GW2Svc.getWorldBySlug($rp.worldSlug, $scope.active.lang.slug, function(err, world) {
				$scope.active.world = world;
				console.log('$scope.active.world', $scope.active.world);
				callback();
			});
		}
		else {
			callback();
		}
	}





	/*
	*	Error Handlers
	*/

	function __error(errMessage, newPath, callback) {
		alert(errMessage);
		console.log(errMessage);

		$location.path(newPath);

		callback();
	}


}]);
