
/*!
 *
 *	Services - GW2ApiSvc
 *
 !*/

angular.module('gw2app').service('GW2ApiSvc', [
	'$http',
	'GW2DataSvc',
function(
	$http,
	GW2DataSvc
) {
	"use strict";


	/*
	*	Public Properties
	*/

	var svc = {};


	/*
	*	Private Properties
	*/

	var __INSTANCE = {
		remotesInProgress: {},

		api: {
			protocol: 'https://',
			hostname: 'api.guildwars2.com',

			endPoints: {
				events: '/v1/events.json',							// http://wiki.guildwars2.com/wiki/API:1/events
				eventNames: '/v1/event_names.json',					// http://wiki.guildwars2.com/wiki/API:1/event_names
				eventDetails: '/v1/event_details.json',				// https://api.guildwars2.com/v1/event_details.json
				mapNames: '/v1/map_names.json',						// http://wiki.guildwars2.com/wiki/API:1/map_names
				worldNames: '/v1/world_names.json',					// http://wiki.guildwars2.com/wiki/API:1/world_names

				guildDetails: '/v1/guild_details.json',				// http://wiki.guildwars2.com/wiki/API:1/guild_details

				items: '/v1/items.json',							// http://wiki.guildwars2.com/wiki/API:1/items
				itemDetails: '/v1/item_details.json',				// http://wiki.guildwars2.com/wiki/API:1/item_details
				recipes: '/v1/recipes.json',						// http://wiki.guildwars2.com/wiki/API:1/recipes
				recipeDetails: '/v1/recipe_details.json',			// http://wiki.guildwars2.com/wiki/API:1/recipe_details

				continents: '/v1/continents.json',					// http://wiki.guildwars2.com/wiki/API:1/continents
				maps: '/v1/maps.json',								// http://wiki.guildwars2.com/wiki/API:1/maps
				mapFloor: '/v1/map_floor.json',						// http://wiki.guildwars2.com/wiki/API:1/map_floor

				objectiveNames: '/v1/wvw/objective_names.json',		// http://wiki.guildwars2.com/wiki/API:1/wvw/matches
				matches: '/v1/wvw/matches.json',					// http://wiki.guildwars2.com/wiki/API:1/wvw/match_details
				matchDetails: '/v1/wvw/match_details.json',			// http://wiki.guildwars2.com/wiki/API:1/wvw/objective_names
			},

		},
	};



	/*
	 *
	 *	Public Methods
	 *
	 */


	/*
	 *  Remote Getters
	 */


	svc.getWorlds = function getWorlds(params, callback, attemptNum) {
		// __get({
		// 	cacheKey: 'worlds:' + params.lang,
		// 	cacheTime: 1000 * 60 * 60,  // 1 hour
		// 	apiUrl: __getWorldsUrl({lang: params.lang}),
		// 	onRemoteData: __prepareWorlds.bind(null, params.lang),
		// 	fnValidator: __isValidWorldsData,
		// }, callback);

		__get({
			cacheKey: 'worlds:' + params.lang,
			cacheTime: 1000 * 60 * 60,  // 1 hour
			apiUrl: '/dist/cache/world_names.' + params.lang + '.json',
			onRemoteData: __prepareWorlds.bind(null, params.lang),
			fnValidator: __isValidWorldsData,
		}, callback);
	};


	svc.getMatches = function getMatches(params, callback, attemptNum) {
		__get({
			cacheKey: 'matches',
			cacheTime: 1000 * 10 * 1,  // 10 seconds
			apiUrl: __getMatchesUrl(),
			onRemoteData: __prepareMatches,
			fnValidator: function() {
				return true;
			},  //FIXME
		}, callback);
	};

	svc.getObjectives = function getObjectives(params, callback, attemptNum) {
		__get({
			cacheKey: 'objectives',
			cacheTime: 1000 * 60 * 60,  // 1 hour
			apiUrl: __getObjectivesUrl(),
			onRemoteData: __prepareObjectives,
			fnValidator: function() {
				return true;
			},  //FIXME
		}, callback);
	};


	svc.getMatchDetails = function getMatchDetails(params, callback, attemptNum) {
		__get({
			cacheKey: 'matchDetails:' + params.matchId,
			cacheTime: 1000 * 2,  // 2 seconds
			apiUrl: __getMatchDetailsUrl({match_id: params.matchId}),
			onRemoteData: prepareMatchDetails,
			fnValidator: function() {
				return true;
			},  //FIXME
		}, callback);
	};


	svc.getGuildDetails = function getGuildDetails(params, callback, attemptNum) {
		__get({
			cacheKey: 'guild:' + params.guildId,
			cacheTime: 1000 * 2,  // 2 seconds
			apiUrl: __getGuildDetailsUrl({guild_id: params.guild_id}),
			onRemoteData: prepareGuildDetails,
			fnValidator: function() {
				return true;
			},  //FIXME
		}, callback);
	};





	/*
	*
	*	Private Methods
	*
	*/


	/*
	*	API Access
	*/

	function __get(config, callback, attemptNum) {
		__INSTANCE.remotesInProgress[config.cacheKey] = __INSTANCE.remotesInProgress[config.cacheKey] || false;

		if (__INSTANCE.remotesInProgress[config.cacheKey]) {
			// wait and re-call getter
			setTimeout(__get.bind(null, config, callback, attemptNum), 100);
		}
		else {
			// console.log('GET REMOTE :: ' + config.cacheKey);

			$http.get(config.apiUrl)
				.success(config.onRemoteData.bind(null, function(remoteData) {
					__INSTANCE.remotesInProgress[config.cacheKey] = false;

					if (config.fnValidator(remoteData)) {
						// setTimeout(callback.bind(null, remoteData), 50);	// latency simulator
						callback(null, remoteData);
					}
					else {
						__retryGet(config, callback, attemptNum);
					}

				}))
				.error(__retryGet.bind(null, config, callback, attemptNum));
		}
	};


	function __retryGet(config, callback, attemptNum) {
		attemptNum = ++attemptNum || 1;

		var timeout = generateRetryTimeout(attemptNum);
		console.log('retry getter', timeout, config);
		setTimeout(
			__get.bind(null, config, callback, attemptNum),
			timeout
		);
	};



	/*
	 *  onRemoteData handlers
	 */

	function __prepareWorlds(lang, callback, jsonData, status) {
		angular.forEach(jsonData, function(world) {
			world.id = parseInt(world.id);
			world.region = GW2DataSvc.getRegion(world.id);
			world.slug = _.str.slugify(world.name.replace('ß', 'ss'));
			world.link = ['', lang, world.slug].join('/');
		});

		callback(jsonData);
	};


	function __prepareMatches(callback, jsonData, status) {
		var matches = jsonData.wvw_matches;

		angular.forEach(matches, function(match) {
			match.region = GW2DataSvc.getRegion(match.wvw_match_id);
		});

		callback(matches);
	};


	function __prepareObjectives(callback, jsonData, status) {
		var objectives = {};
		async.forEach(
			jsonData,
			function(objective, next) {
				objective.type = GW2DataSvc.getObjectiveType(objective.name);
				objectives[objective.id] = objective;
				next();
			},
			callback.bind(null, objectives)
		);
	};


	function prepareMatchDetails(callback, jsonData, status) {
		callback(jsonData);
	};


	function prepareGuildDetails(callback, jsonData, status) {
		delete jsonData.emblem;

		// setTimeout(callback.bind(null, jsonData), 1000 * 3);
		callback(jsonData);
	};



	/*
	 *  data validators
	 */

	function __isValidWorldsData(worldsData) {
		return (worldsData.length >= 51);
	};





	/*
	 *	URL Builders
	 */

	function __getWorldsUrl(params) {
		return __getApiUrl('worldNames', params);
	}


	function __getGuildDetailsUrl(params) {
		if (!params || (!params.guild_id && !params.guild_name)) {
			throw ('Either guild_id or guild_name must be passed');
		}
		return __getApiUrl('guildDetails', params);
	}


	function __getObjectivesUrl(params) {
		return __getApiUrl('objectiveNames', params);
	}


	function __getMatchesUrl(params) {
		return __getApiUrl('matches', params);
	}


	function __getMatchDetailsUrl(params) {
		if (!params || !params.match_id) {
			throw ('match_id is a required parameter');
		}
		return __getApiUrl('matchDetails', params);
	}


	/*
		select * from json where url in (
			select url from uritemplate
			where template = "https://api.guildwars2.com/v1/wvw/match_details.json?match_id={matchId}"
				and matchId in("1-1", "1-2", "1-3")
		)
	*/
	function getMatchDetailsYQL(matchIdArray) {
		var guildIdList = '"' + matchIdArray.join('", "') + '"';
		var yql = _.str.sprintf('select * from json where url in (select url from uritemplate where template = "https://api.guildwars2.com/v1/wvw/match_details.json?match_id={matchId}" and matchId in(%s))', guildIdList);
		var yqlUrl = _.str.sprintf('http://query.yahooapis.com/v1/public/yql?format=json&q=%s', encodeURIComponent(yql));

		// console.log(matchIdArray, yql, yqlUrl);

		return yqlUrl;
	}


	function __getApiUrl(endpoint, params) {
		if (!__INSTANCE.api.endPoints[endpoint]) {
			throw ('Invalid endpoint: ' + endpoint);
		}
		var apiUrl = [
			__INSTANCE.api.protocol,
			__INSTANCE.api.hostname,
			__INSTANCE.api.endPoints[endpoint],
			__paramsToQueryString(params),
		].join('');

		// console.log(apiUrl)
		return apiUrl;
	};


	function __paramsToQueryString(params) {
		var qs;
		if (params && Object.keys(params).length) {
			qs = [];
			angular.forEach(params, function(val, key) {
				qs.push(key + '=' + val);
			});
			qs = '?' + qs.join('&');
		}
		else {
			qs = '';
		}
		return qs;
	};



	/*
	*	Utility
	*/

	function generateRetryTimeout(k) {
		var upperLimit = 60 * 1000;

		var maxTimeout = (Math.pow(2, k) - 1) * 1000;

		if (maxTimeout > upperLimit) {
			maxTimeout = upperLimit;
		}

		var minTimeout = maxTimeout / 2;

		return _.random(minTimeout, maxTimeout);
	};



	return svc;
}]);
