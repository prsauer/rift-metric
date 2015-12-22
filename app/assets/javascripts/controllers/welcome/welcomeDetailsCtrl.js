
angular.module('mainApp')
.controller('welcomeDetailsCtrl',
       ['$scope', '$state', '$stateParams', 'DataService', 'ControlsData',
function($scope,   $state,   $stateParams,   DataService,   ControlsData) {
  console.log("Details Controller FIRE");

  this.kills_data_ready = false;
  this.deaths_data_ready = false;
  this.perfs_data_ready = false;
  this.details_data_ready = false;

  this.vm = DataService;
  this.controls_watcher = ControlsData;
  this.matchid = $stateParams.matchId;

  $scope.back_to_list = function() {
    $state.go('listView', {summonerName: $stateParams.summonerName, showKills: ControlsData.show_kills, showDeaths: ControlsData.show_deaths});
  };

  this.round = Math.round;

  if (ControlsData.summonerName != "" && this.matchid != undefined && this.matchid != "") {

    DataService.gatherDetails(this.matchid).then(
      function(res) {
        $scope.details_ctrl.details_data_ready = true;
      },
      function(err) {
        console.log(err);
      }
    );

    DataService.gatherPerformance(ControlsData.summonerName, this.matchid).then(
      function(res) {
        $scope.details_ctrl.perfs_data_ready = true;
      },
      function(err) {
        console.log(err);
      }
    );

    DataService.gatherKills(ControlsData.summonerName, this.matchid).then(
      function(res) {
        $scope.details_ctrl.kills_data_ready = true;
      },
      function(err) {
        console.log(err);
      }
    );

    DataService.gatherDeaths(ControlsData.summonerName, this.matchid).then(
      function(res) {
        $scope.details_ctrl.deaths_data_ready = true;
      },
      function(err) {
        console.log(err);
      }
    );
  }
  else {
    console.log("Error in DetailsCtrl -- not enough args");
  }


}

]);
