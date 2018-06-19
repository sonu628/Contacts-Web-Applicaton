angular.module('ContactsApp')
    .value('FieldTypes', {
        text : ['Text', 'shoubld be text'],
        email : ['Email', 'shoubld be email-address'],
        number : ['Number', 'shoubld be a number'],
        date : ['Date', 'shoubld be a date'],
        datetime : ['Datetime', 'shoubld be a datetime'],
        time : ['Time', 'shoubld be a time'],
        month : ['Month', 'shoubld be a month'],
        week : ['Week', 'shoubld be a week'],
        url : ['Url', 'shoubld be  a url'],
        tel : ['Phone Number', 'shoubld be a phone number'],
        color : ['Color', 'should be a color']
    })
    .directive('formField', function ($timeout, FieldTypes) {
        return {
            restrict : 'EA',
            templateUrl : 'views/form-field.html',
            replace: true,
            scope: {
                record : '=',
                field: '@',
                live: '@',
                required: '@'
            },
            link: function ($scope, element, attr) {
                $scope.$on('record:invalid', function () {
                    $scope[$scope.field].$setDirty();
                });
                $scope.blurUpdate = function () {
                    if ($scope.live !== 'false') {
                        $scope.record.$update(function (updatedRecord) {
                            $scope.record = updatedRecord;
                        });
                    }
                };
                $scope.types = FieldTypes;
                $scope.data = 'data';
                $scope.remove = function (field) {
                    delete $scope.record[field];
                    $scope.blurUpdate();
                };
                var SaveTimeout;
                $scope.update = function () {
                    $timeout.cancel(SaveTimeout);
                    SaveTimeout = $timeout($scope.blueUpdate, 1000);
                };
            }
        };
    })
    .directive('newField', function ($filter, FieldTypes) {
        return {
            restrict : 'EA',
            templateUrl : 'views/new-field.html',
            replace : 'true',
            scope : {
                record : '=',
                live : '@'
            },
            require : '^form',
            link: function ($scope, element, attr, form) {
                $scope.types = FieldTypes;
                $scope.field = {};
                
                $scope.show = function (type) {
                    $scope.field.type = type;
                    $scope.display = true;
                };
                
                $scope.remove = function () {
                    $scope.field = {};
                    $scope.display = false;
                };
                
                $scope.add = function () {
                    if (form.newField.$valid) {
                        $scope.record[$filter('camelCase')($scope.field.name)] = [$scope.field.value, $scope.field.type];
                        $scope.remove();
                        if ($scope.live !== 'true') {
                            $scope.record.$update(function (updatedRecord) {
                                $scope.record = updatedRecord;
                            });
                        }
                    }
                };
            }
        };
    });