
/*!
 *
 *	Services - CacheSvc
 *
 !*/

angular.module('gw2app').service('MemCacheSvc', ['$timeout', function($timeout) {
	"use strict";

	/*
	*	Public Properties
	*/
	var svc = {};


	/*
	*	Private Properties
	*/
	var __CACHE = {};


	/*
	*	Public Methods
	*/

	svc.put = function put(key, value, time, timeoutCallback, onPut) {
		if (angular.isDefined(__CACHE[key])) {
			$timeout.cancel(__CACHE[key].timeout);
		}

		var expire = (angular.isNumber(time))
			? time + Date.now()
			: null;

		var item = {value: value, expire: expire};

		if (angular.isNumber(expire)) {

			timeoutCallback = (timeoutCallback || angular.noop).bind(null, key);

			item.timeout = $timeout(
				svc.del.bind(null, key, timeoutCallback),
				time
			);

		}

		onPut(null, __CACHE[key] = item);
	};


	svc.get = function put(key, onGet) {
		var item = __CACHE[key];
		if (item) {
			if (!angular.isNumber(item.expire) || item.expire >= Date.now()) {
				onGet(null, item.value);
			} else {
				svc.del(key, onGet);
			}
		}
		else {
			onGet(null);
		}
	};


	svc.del = function del(key, onDel) {
		onDel(null, delete __CACHE[key]);
	};


	svc.clear = function clear(onClear) {
		onClear(null, __CACHE = {});
	};


	svc.clearTimeouts = function clearTimeouts(onCT) {
		angular.forEach(__CACHE, function(item) {
			$timeout.cancel(item.timeout);
		});
		onCT(null);
	};


	return svc;
}]);
