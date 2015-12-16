angular.module('mainApp').controller('welcomeDetailsCtrl',

['$scope', '$location', '$http', '$routeParams', 'KillData', 'DeathData', 'MatchList',

function($scope, $location, $http, $routeParams, KillData, DeathData, MatchList) {
  console.log($routeParams.summonerName != undefined);

  $scope.d3Data = {
    summonerName: $routeParams.summonerName,
    kills: KillData.data,
    deaths: DeathData.data,
    matches: MatchList.data,
    show_kills: $routeParams.showKills == "true",
    show_deaths: $routeParams.showDeaths == "true",
    selected_match: $routeParams.matchId
  };

  console.log("Show Kills: " + $scope.d3Data.show_kills + " Deaths: " + $scope.d3Data.show_deaths);
  console.log($scope);

  KillData.loadPosts($routeParams.summonerName);
  DeathData.loadPosts($routeParams.summonerName);
  MatchList.loadPosts($routeParams.summonerName);

  $scope.back_to_list = function() {
    $location.path("/list/" + $routeParams.summonerName + "/true/false");
  };

}

]);
