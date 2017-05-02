angular.module('events').config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/events', {
            templateUrl: 'events/views/list-events.client.view.html'
        }).
        when('/events/create', {
            templateUrl: 'events/views/create-event.client.view.html'
        }).
        when('/events/:eventId', {
            templateUrl: 'events/views/view-event.client.view.html'
        }).
        when('/events/:eventId/edit', {
            templateUrl: 'events/views/edit-event.client.view.html'
        });
    }
]);