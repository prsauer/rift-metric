
angular.module('mainApp')
.controller('welcomeSigmaCtrl',
       ['$scope', '$location', '$http', '$stateParams', 'ControlsData', '$state', 'DataService',
function($scope,   $location,   $http,   $stateParams,   ControlsData,   $state,   DataService) {
  console.log("Sigma Controller FIRE");

  this.matches = {};
  this.data_watcher = DataService;
  this.controls_watcher = ControlsData;
  this.absUrl = $location;

  $scope.back_to_list = function() {
    $state.go('listView', {summonerName: $stateParams.summonerName, showKills: ControlsData.show_kills, showDeaths: ControlsData.show_deaths});
  };

  DataService.gatherMatchIds($stateParams.summonerName).then(
    function(res) {
      $scope.sigma_ctrl.matches = res;
      console.log(res);
      DataService.gatherSigmaKills(ControlsData.summonerName).then(
        function(res) {
        },
        function(err) {
          console.log(err);
        }
      );

      DataService.gatherSigmaDeaths(ControlsData.summonerName).then(
        function(res) {
        },
        function(err) {
          console.log(err);
        }
      );
    },
    function(err) {
      console.log(err);
    }
  );

}

]);
