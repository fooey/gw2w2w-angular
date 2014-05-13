
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




angular.module('gw2app').directive('gw2Objective', ['$timeout', function($timeout) {
	function link($scope, element, attrs) {
		$scope.directionArrow = getDirectionArrow($scope.objectiveMeta);


		function getDirectionArrow(meta) {
			var src = ['/dist/img/min/arrow'];

			if (meta.n) {src.push('north'); }
			else if (meta.s) {src.push('south'); }

			if (meta.w) {src.push('west'); }
			else if (meta.e) {src.push('east'); }

			return src.join('-') + '.svg';
		}

	}


	return {
		scope: {
			columns: "=columns",
			timestamp: "=timestamp",
			commonName: "=commonName",
			objectiveId: "=objectiveId",
			objective: "=objective",
			objectiveState: "=objectiveState",
			objectiveMeta: "=objectiveMeta",
			objectiveGuild: "=objectiveGuild",
			mapName: "=objectiveMapName",
			descriptionType: "=descriptionType",
		},
		restrict: 'E',
		link: link,
		templateUrl: '/partials/tracker-objective'
	};
}]);
