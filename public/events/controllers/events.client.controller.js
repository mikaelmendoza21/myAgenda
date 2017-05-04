angular.module('events').controller('EventsController', ['$scope', '$routeParams', '$location', 'Authentication', 'Events',
    function($scope, $routeParams, $location, Authentication, Events) {
        $scope.authentication = Authentication;

        $scope.create = function() {
            console.log("Creating new Event - Date="+ JSON.stringify(this.date) 
                + " Title="+ JSON.stringify(this.title) );
            var event = new Events({
                title: this.title,
                date: this.date
            });

            event.$save(function(response) {
                $location.path('events/' + response._id);
                console.log("Back from ng-service");
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.find = function() {
            $scope.event = Events.query();
        };

        $scope.findOne = function() {
            $scope.event = Events.get({
                eventId: $routeParams.eventId
            });
        };

        $scope.update = function() {
            $scope.event.$update(function() {
                $location.path('events/' + $scope.event._id);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.delete = function(event) {
            if (event) {
                event.$remove(function() {
                    for (var i in $scope.events) {
                        if ($scope.events[i] === event) {
                            $scope.events.splice(i, 1);
                        }
                    }
                });
            } else {
                $scope.event.$remove(function() {
                    $location.path('events');
                });
            }
        };
    }
]);