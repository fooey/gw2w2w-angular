
/*!
 *
 *	Controllers - Overview
 *
 !*/

angular.module('gw2app').controller('OverviewCtrl', [
	'$scope',
	'$timeout',

	'GW2Svc',
	'i18nSvc',
function(
	$scope,
	$timeout,

	GW2Svc,
	i18nSvc
) {
	'use strict';

	console.log('\nAPP MODE :: Overview\n');


	var matchDetailsTimeoutPriority = 2; // 4-8


	/*
	*	INIT
	*/

	$scope.$on('appInit', function() {
		console.log('OverviewCtrl Starting');

		async.auto({
			'initMatchScores': __initMatchScores,
			'setPageTitle': __setPageTitle,
		},
		function() {
			console.log('OverviewCtrl Ready');
		});
	});


	$scope.pieChartInfo = function(matchId) {
		return {
			scores: $scope.scores[match.wvw_match_id],
			size: 60,
			strokeWidth: 2
		};
	}





	/*
	*	PRIVATE METHODS
	*/

	function __initMatchScores(callback) {
		var matchIds = _.pluck($scope.matches, 'wvw_match_id');

		async.each(
			matchIds,
			function(matchId, nextMatch) {
				var scopeKey = '$scope.scores.' + matchId;

				__watchMatchScores(matchId);

				$scope.getMatchDetails(matchDetailsTimeoutPriority, matchId, nextMatch);
			},
			callback
		);
	}


	function __setPageTitle(callback) {
		var pageTitle = [
			'GuildWars2 WvW',
			i18nSvc["liveScores"][$scope.active.lang.slug],
		];

		if ($scope.active.lang.slug !== 'en') {
			pageTitle.push('(' + $scope.active.lang.name + ')');
		}

		$scope.setPageTitle(pageTitle.join(' '), callback);
	}


	function __watchMatchScores(matchId) {
		$scope.$watch(
			function() {return $scope.scores[matchId]},
			__onScoreChange.bind(null, matchId)
		);
	}


	function __onScoreChange(matchId, newVal, oldVal) {
		if (newVal && oldVal) {
			$scope.scoreDiff[matchId] = [
				newVal[0] - oldVal[0],
				newVal[1] - oldVal[1],
				newVal[2] - oldVal[2],
			];
		}
	};

}]);
