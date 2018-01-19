angular
    .module('loc8rApp', [])
    .controller('locationListController', locationListController)
    .filter('formatDistanceFilter', formatDistanceFilter)
    .directive('starRatingDirective', starRatingDirective);

var locationListController = function ($scope) {
    $scope.data = {
        locations: [{
            name: 'Burger Queen',
            address: '125 High Street, Reading, RG6 1PS',
            rating: 3,
            facilities: ['Hot drinks', 'Food', 'Premium wifi'],
            distance: '0.296456',
            _id: '5370a35f2536f6785f8dfb6a'
        }, {
            name: 'Costy',
            address: '125 High Street, Reading, RG6 1PS',
            rating: 5,
            facilities: ['Hot drinks', 'Food', 'Alcoholic drinks'],
            distance: '0.7865456',
            _id: '5370a35f2536f6785f8dfb6a'
        }]
    };
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

var starRatingDirective = function() {
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