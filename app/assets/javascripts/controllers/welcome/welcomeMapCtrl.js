
angular.module('mainApp').controller('MapCtrl', ['$scope', 'DataService', 'ControlsData', '$timeout',

function($scope, DataService, ControlsData, $timeout) {

  this.kills_data_ready = false;
  this.deaths_data_ready = false;
  this.perfs_data_ready = false;
  this.details_data_ready = false;

  this.my_matchid = $scope.$parent.$parent.matchid;
  this.controls_watcher = ControlsData;
  this.victory = "loading...";
  this.vm = DataService;

  this.convert_riot_time = function (ts) {
    //console.log(ts);
    var d = new Date();
    d.setTime(ts);
    //console.log(d);
    return d.toLocaleTimeString() + " " + d.toLocaleDateString();
  }

  if (ControlsData.summonerName != "" && this.my_matchid != undefined) {

    DataService.gatherDetails(this.my_matchid).then(
      function(res) {
        $scope.mapc.details_data_ready = true;
      },
      function(err) {
        console.log(err);
      }
    );

    DataService.gatherPerformance(ControlsData.summonerName, $scope.$parent.$parent.matchid).then(
      function(res) {
        $scope.mapc.perfs_data_ready = true;
        // console.log($scope);
        // console.log($scope.mapc.my_matchid);
        // console.log(DataService.performances[$scope.mapc.my_matchid]);
        // console.log(DataService.performances);
        $scope.mapc.victory = DataService.performances[$scope.mapc.my_matchid].winner?"Victory":"Defeat";
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
