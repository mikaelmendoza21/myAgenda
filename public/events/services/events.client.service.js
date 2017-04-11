angular.module('events').factory('Events', ['$resource',
    function($resource) {
        return $resource('api/event/:eventId', {
            eventId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);