
angular.module('mainApp').controller('MapCtrl', ['$scope', 'ShareData',

function($scope, ShareData) {
  $scope.data = ShareData;
}
]);
