

angular.module('mainApp').controller('welcomeListViewCtrl',
       ['$timeout', '$rootScope', '$scope', '$location', '$http', '$stateParams', 'DataService', 'ControlsData',
function($timeout,   $rootScope,   $scope,   $location,   $http,   $stateParams,   DataService, ControlsData) {
  console.log("ListViewCtrl FIRE");

  if ($stateParams.summonerName != undefined) {

    if ($stateParams.showDeaths == undefined) {
      if ($stateParams.showKills != undefined) {
        $location.path("/list/" + $stateParams.summonerName + "/" + $stateParams.showKills + "/false");
      }
      else {
        $location.path("/list/" + $stateParams.summonerName + "/true/false");
      }
    }

    this.matches = {};
    this.controlsData = ControlsData;
    this.error_state = true;
    this.error_message = "Loading...";
    this.gdata = champ_gdata_id;

    DataService.gatherMatchIds($stateParams.summonerName).then(
      function(res) {
        $scope.list_ctrl.error_message = "Loading...";
        $scope.list_ctrl.matches = res;
        $scope.list_ctrl.error_state = false;
      },
      function(err) {
        $scope.list_ctrl.error_state = true;
        $scope.list_ctrl.error_message = "Could not find any data for summoner " + $stateParams.summonerName;
        console.log("err fire");
      }
    );
  }
}]);
