
/*!
*
*	Directives
*
!*/

angular.module('gw2app').directive('pieChart', function() {
	function link($scope, element, attrs) {
		var size = $scope.size;
		var strokeWidth = $scope.strokewidth;
		var scores = $scope.scores;

		var $img = $('<img />', {"class": "pieChart"}).hide();
		var $loading = $('<i>', {"class": "fa fa-spinner fa-spin chartLoading"}).hide();


		element.append($img).append($loading);

		$scope.$watch('scores', function(newScores) {
			if (scores !== newScores && newScores && newScores.length) {
				scores = newScores;
				$loading.hide();
				$img.show().attr('src', 'http://piely.net/60/' + scores.join(',') + '?strokeWidth=2');
			}
			else if (!newScores) {
				$loading.fadeIn();
			}
		});
	}

	return {
		scope: {
			scores: '=scores',
			size: '=size',
			strokewidth: '=strokewidth',
		},
		restrict: 'E',
		link: link,
	};
});




angular.module('gw2app').directive('gw2Objective', [function() {
	function link($scope, element, attrs) {

		$scope.isStatic = (angular.isDefined($scope.isStatic)) 
			? $scope.isStatic 
			: false;

		var watchers = {};

		addWatcher('watchedObjective', 'objective');
		addWatcher('watchedState', 'state');
		addWatcher('watchedGuild', 'guild');


		function addWatcher(watchedVal, scopeKey) {
			watchers[watchedVal] = $scope.$watch(watchedVal, function(newVal) {
				if (newVal) {
					$scope[scopeKey] = ($scope.isStatic) ? _.cloneDeep(newVal) : newVal;

					if ($scope.isStatic) {
						__unwatch(watchedVal);
					}
				}
			});
		}




		$scope.getDirectionArrow = function(meta) {
			var src = ['/dist/img/min/arrow'];

			if (meta.n) {src.push('north'); }
			else if (meta.s) {src.push('south'); }

			if (meta.w) {src.push('west'); }
			else if (meta.e) {src.push('east'); }

			return src.join('-') + '.svg';
		};



		var buffDuration = 1000 * 60 * 5;
		$scope.buffTimer = _.throttle(function() {
			if ($scope.state) {
				return ($scope.state.lastCaptured + buffDuration) - __dateSeconds();
			}
			else {
				return 0;
			}

		}, 1000/3);



		// function __watchState() {
		// 	__watchOnce('state', __watchGuild);
		// }


		// function __watchGuild() {
		// 	if ($scope.objective.state.owner_guild) {
		// 		// console.log('__watchGuild()', $scope.objective.state.owner_guild)
		// 		__watchOnce('guild', function() {
		// 			// console.log('__watchGuild() completed', $scope.objective.guild);
		// 		});
		// 	}
		// }



		// function __watchOnce(key, onData) {
		// 	var toWatch = 'watchedObjective.' + key;

		// 	if ($scope.watchedObjective[key]) {
		// 		$scope.objective[key] = _.cloneDeep($scope.watchedObjective[key]);
		// 	}

		// 	if (angular.isUndefined($scope.objective[key])) {
		// 		// console.log('__watchOnce', $scope.objective.id, key);

		// 		watchers[toWatch] = $scope.$watch(toWatch, function(newVal) {
		// 			if (newVal && angular.isUndefined($scope.objective[key])) {

		// 				// console.log('__watchOnce triggered', $scope.objective.id, key);

		// 				$scope.objective[key] = newVal;
		// 				__unwatch(toWatch);

		// 				onData();
		// 			}

		// 		});
				
		// 	}
		// 	else {
		// 		// console.log('predefined', 'watchedObjective.' + key);
		// 		onData();
		// 	}

		// }


		function __dateSeconds() {
			// nearest second so that buff timers update at the same time
			return __roundToSecond(Date.now());
		}

		function __roundToSecond(msDate) {
			return Math.round(msDate / 1000) * 1000;
		}


		function __unwatch(key) {
			// console.log('__unwatch', $scope.objective.id, key);
			watchers[key] && watchers[key]();
		}

	}


	return {
		scope: {
			columns: "=columns",
			langKey: "=langKey",

			watchedObjective: "=objective",
			watchedState: "=state",
			watchedGuild: "=guild",

			timestamp: "=?timestamp",
			isStatic: "=?isStatic",
			mapName: "=?mapName",
			descriptionType: "=?descriptionType",
		},
		restrict: 'E',
		link: link,
		templateUrl: '/partials/tracker-objective'
	};
}]);