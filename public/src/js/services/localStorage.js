
/*!
 *
 *	Services - CacheSvc
 *
 !*/

 // http://stackoverflow.com/questions/4461884/local-storage-html5-demo-with-code

angular.module('gw2app').service('LocalStorageSvc', ['$timeout', function($timeout) {
	"use strict";

	/*
	*	Public Properties
	*/
	var svc = {};


	/*
	*	Private Properties
	*/

	var __INSTANCE = {
		prefix: 'gw2w2w::',
	};


	/*
	*
	*	Public Methods
	*
	*/


	/*
	*	Individual Items
	*/

	svc.put = function put(key, value, time, callback) {
		var fullKey = getFullKey(key);
		var expire = (angular.isNumber(time))
			? time + Date.now()
			: null;

		var item = angular.toJson({value: value, expire: expire});

		localStorage[fullKey] = item;

		callback(item);
	};


	svc.get = function get(key, callback) {
		var fullKey = getFullKey(key);
		var itemJson = localStorage[fullKey];
		var toReturn = null;

		if (itemJson) {
			var item = angular.fromJson(itemJson);

			if (!angular.isNumber(item.expire) || item.expire >= Date.now()) {
				callback(item.value);
			} else {
				svc.del(key, callback);
			}
		}
		else {
			callback(null);
		}
	};


	svc.del = function del(key, callback) {
		var fullKey = getFullKey(key);

		localStorage.removeItem(fullKey);

		callback();
	};



	/*
	*	Bulk Records
	*/

	svc.clear = function clear(callback) {
		localStorage.clear();
		callback(null);
	};



	/*
	*	Utility
	*/

	function getFullKey(key) {
		return (__INSTANCE.prefix + key);
	}


	function getKeyFromFull(fullKey) {
		return fullKey.split('::')[1];
	}


	return svc;
}]);
