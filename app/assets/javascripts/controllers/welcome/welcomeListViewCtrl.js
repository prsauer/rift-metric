

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

    DataService.gatherMatchIds($stateParams.summonerName).then(
      function(res) {
        $scope.list_ctrl.matches = res;
      },
      function(err) {
        console.log(err);
      }
    );
  }
}]);
