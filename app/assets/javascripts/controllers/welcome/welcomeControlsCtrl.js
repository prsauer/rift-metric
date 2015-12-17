angular.module('mainApp').controller('welcomeControlsCtrl',

['$rootScope', '$scope', '$location', '$stateParams', 'ShareData',

function($rootScope, $scope, $location, $stateParams, ShareData) {
  console.log("Controls Controller FIRE");

  ShareData.show_kills = $stateParams.showKills == "true";
  ShareData.show_deaths = $stateParams.showDeaths == "true";
  
  $scope.d3Data = ShareData;

  $scope.controls_touched = function() {
    ShareData.show_kills =  $scope.d3Data.show_kills;
    ShareData.show_deaths = $scope.d3Data.show_deaths;
  };

  $scope.back_to_list = function() {
    $location.path("heatmaps/list/" + $stateParams.summonerName + "/true/false");
  };

  $scope.go_to_sigma = function() {
    $location.path("heatmaps/sigma/" + $stateParams.summonerName + "/true/false");
  };
}

]);
