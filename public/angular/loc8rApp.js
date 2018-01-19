angular
    .module('loc8rApp', []);

var locationDataService = function ($http) {
    return {
        getLocations: function () {
            return $http.get('/api/locations?lng=-0.79&lat=51.3&maxDistance=20');
        }
    };
};

var geoLocationService = function () {
    var getPosition = function (successCallback, errorCallback, noGeoCallback) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
        } else {
            noGeoCallback();
        }
    };

    return {
        getPosition: getPosition
    };
};

var locationListController = function ($scope, locationDataService, geoLocationService) {
    $scope.message = "some message";
    locationDataService.getLocations()
        .success(function (data) {
            $scope.locations = data;
        })
        .error(function (error) {
            $scope.message = error;
        });
};

var formatDistanceFilter = function () {
    return function (distance) {
        var numDistance, unit;
        if (distance && _isNumeric(distance)) {
            if (distance > 1) {
                numDistance = parseFloat(distance).toFixed(1);
                unit = 'km';
            } else {
                numDistance = parseInt(distance * 1000, 10);
                unit = 'm';
            }
            return numDistance + unit;
        } else {
            return "?";
        }
    };
};

var starRatingDirective = function () {
    return {
        scope: {
            thisRating: '=rating'
        },
        templateUrl: 'angular/star-rating-directive.html'
    }
};

var _isNumeric = function (n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
};

angular
    .module('loc8rApp')
    .controller('locationListController', locationListController)
    .filter('formatDistanceFilter', formatDistanceFilter)
    .directive('starRatingDirective', starRatingDirective)
    .service('locationDataService', locationDataService)
    .service('geoLocationService', geoLocationService);