/*!
*
*	app
*
!*/

console.log('');
console.log('******************************');
console.log('*    Starting Application    *');
console.log('******************************');
console.log('');

/* App Module */
var gw2app = angular.module('gw2app', ['ngRoute', 'ngAnimate']);

gw2app.config([
	'$routeProvider',
	'$locationProvider',
function(
	$routeProvider,
	$locationProvider
) {
	'use strict';

	$locationProvider.html5Mode(true);

	$routeProvider
		.when('/', {
			redirectTo: '/en'
		})
		.when('/:lang', {
			templateUrl: '/partials/app',
			controller: 'AppCtrl'
		})

		.when('/:lang/:worldSlug', {
			templateUrl: '/partials/app',
			controller: 'AppCtrl'
		});


		// .when('/:lang', {
		// 	templateUrl: '/partials/overview',
		// 	controller: 'OverviewCtrl'
		// })

		// .when('/:lang/:worldSlug', {
		// 	templateUrl: '/partials/tracker',
		// 	controller: 'TrackerCtrl'
		// })

		// .otherwise({
		// 	redirectTo: '/'
		// });
}]);

