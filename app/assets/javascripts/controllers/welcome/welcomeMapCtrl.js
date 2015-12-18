
angular.module('mainApp').controller('MapCtrl', ['$scope', 'DataService', 'ControlsData', '$timeout',

function($scope, DataService, ControlsData, $timeout) {
  //console.log("MapCtrl FIRE scope=");
  //console.log($scope);
  this.kills_data_ready = false;
  this.deaths_data_ready = false;
  this.perfs_data_ready = false;
  this.my_matchid = $scope.$parent.$parent.matchid;
  $scope.controls_watcher = ControlsData;

  if (ControlsData.summonerName != "" && $scope.$parent.$parent.matchid != undefined) {

    DataService.gatherPerformance(ControlsData.summonerName, $scope.$parent.$parent.matchid).then(
      function(res) {
        $scope.mapc.perfs_data_ready = true;
      },
      function(err) {
        console.log(err);
      }
    );

    DataService.gatherKills(ControlsData.summonerName, $scope.$parent.$parent.matchid).then(
      function(res) {
        $scope.mapc.kills_data_ready = true;
      },
      function(err) {
        console.log(err);
      }
    );

    DataService.gatherDeaths(ControlsData.summonerName, $scope.$parent.$parent.matchid).then(
      function(res) {
        $scope.mapc.deaths_data_ready = true;
      },
      function(err) {
        console.log(err);
      }
    );
  }
}
]);
