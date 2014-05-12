
/*!
 *
 *	Filters
 *
 !*/

gw2app.filter('toArray', [function() {
	'use strict';
	return function(obj) {
		if (!angular.isObject(obj)) return obj;
		return _.map(obj, function(val, key) {
			return Object.defineProperty(val, '$key', {__proto__: null, value: key});
		});
	}
}]);



gw2app.filter('pieUrl', [function() {
	'use strict';
	return function(scores, size, strokeWidth) {
		size = size || 60;
		strokeWidth = strokeWidth || 2;
		if (scores) {
			return 'http://piely.net/' + scores.join(',') + '?size=' + size + '&strokeWidth=' + strokeWidth;
		}
		else {
			return;
		}
	};
}]);



gw2app.filter('logFilter', ['GW2DataSvc', function(GW2DataSvc) {
	'use strict';
	return function(timeline, logFilters) {
		// console.log('logFilter', timeline, logFilters)
		if (!angular.isUndefined(timeline) && !angular.isUndefined(logFilters)) {
			var eventFiltered = [];
			var mapFiltered = [];

			// apply event type filters
			angular.forEach(timeline, function(event) {
				if (logFilters.captures && event.type === 'newOwner' || logFilters.claims && event.type === 'newClaimer') {
					eventFiltered.push(event);
				}
			});

			// apply event map filters
			angular.forEach(eventFiltered, function(event) {
				if (GW2DataSvc.wvw.mapObjectives[event.objective.id] && (logFilters.map === 'all' || logFilters.map === GW2DataSvc.wvw.mapObjectives[event.objective.id].mapName)) {
					mapFiltered.push(event);
				}
			});



			return mapFiltered;
		} else {
			return timeline;
		}
	};
}]);
