angular.module('mainApp').controller('welcomeControlsCtrl',

['$rootScope', '$scope', '$location', '$stateParams', 'ControlsData', '$location', '$state',

function($rootScope, $scope, $location, $stateParams, ControlsData, $location, $state) {
  console.log("Controls Controller FIRE");

  ControlsData.show_kills = $stateParams.showKills == "true";
  ControlsData.show_deaths = $stateParams.showDeaths == "true";
  ControlsData.summonerName = $stateParams.summonerName;

  $scope.d3Data = ControlsData;
  $scope.sparams_watcher = $stateParams;

  console.log($scope.d3Data);
  console.log($stateParams);
  console.log($state);

  $scope.controls_touched = function() {
    console.log("Touched");
    ControlsData.show_kills =  $scope.d3Data.show_kills;
    ControlsData.show_deaths = $scope.d3Data.show_deaths;
    ControlsData.summonerName = $stateParams.summonerName;

    $stateParams.showKills = ControlsData.show_kills;

    $state.transitionTo($state.current.name, {summonerName: $stateParams.summonerName, showKills: ControlsData.show_kills, showDeaths: ControlsData.show_deaths}, {notify:false});
  };

  $scope.go_to_sigma = function() {
    $state.go('sigmaView', {summonerName: $stateParams.summonerName, showKills: ControlsData.show_kills, showDeaths: ControlsData.show_deaths});
  };
}

]);
