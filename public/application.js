var appName = 'my-agenda';
var app = angular.module(appName, ['ngResource','ngRoute','example', 'users', 'events']);

angular.element(document).ready(function() {
    angular.bootstrap(document, [appName]);
});
app.config(['$locationProvider', function($locationProvider) {
        $locationProvider.hashPrefix('!');
    }
]);