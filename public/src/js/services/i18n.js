
/*!
 *
 *	Services - i18n
 *
 !*/

angular.module('gw2app').service('i18nSvc', [function() {
	"use strict";
	var i18n = {}; // to public


	i18n["liveScores"] = {
		"en": "Live Scores",
		"es": "Resultados En Directo",
		"de": "Live-Ergebnisse",
		"fr": "Scores en direct",
	};


	return i18n;
}]);
