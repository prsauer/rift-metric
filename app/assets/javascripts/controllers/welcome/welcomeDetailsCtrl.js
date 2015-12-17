angular.module('mainApp').controller('welcomeDetailsCtrl',

['$scope', '$location', '$http', '$stateParams', 'KillData', 'DeathData', 'MatchList', 'ShareData',

function($scope, $location, $http, $stateParams, KillData, DeathData, MatchList, ShareData) {
  console.log("Details Controller FIRE");

  $scope.d3Data = {
    summonerName: $stateParams.summonerName,
    kills: KillData.data,
    deaths: DeathData.data,
    matches: MatchList.data,
    show_kills: $stateParams.showKills == "true",
    show_deaths: $stateParams.showDeaths == "true",
    selected_match: $stateParams.matchId,
    controls: ShareData
  };

  KillData.loadPosts($stateParams.summonerName);
  DeathData.loadPosts($stateParams.summonerName);
  MatchList.loadPosts($stateParams.summonerName);

  $scope.back_to_list = function() {
    $location.path("heatmaps/list/" + $stateParams.summonerName + "/true/false");
  };

  $scope.go_to_sigma = function() {
    $location.path("heatmaps/sigma/" + $stateParams.summonerName + "/true/false");
  };

}

]);
