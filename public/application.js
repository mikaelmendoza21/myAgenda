var appName = 'my-agenda';
var app = angular.module(appName, ['ngRoute','example', 'users']);

angular.element(document).ready(function() {
    angular.bootstrap(document, [appName]);
});
app.config(['$locationProvider', function($locationProvider) {
        $locationProvider.hashPrefix('!');
    }
]);