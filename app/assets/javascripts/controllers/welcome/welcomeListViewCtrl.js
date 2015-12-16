

angular.module('mainApp').controller('welcomeListViewCtrl', ['$scope', '$location', '$http', '$routeParams', 'KillData', 'DeathData', 'MatchList', function($scope, $location, $http, $routeParams, KillData, DeathData, MatchList) {
  console.log("ListViewCtrl firing");

  if ($routeParams.summonerName != undefined) {

    if ($routeParams.showDeaths == undefined) {
      if ($routeParams.showKills != undefined) {
        $location.path("/list/" + $routeParams.summonerName + "/" + $routeParams.showKills + "/false");
      }
      else {
        $location.path("/list/" + $routeParams.summonerName + "/true/false");
      }
    }

    console.log($routeParams.summonerName != undefined);

    $scope.d3Data = {
      summonerName: $routeParams.summonerName,
      kills: KillData.data,
      deaths: DeathData.data,
      matches: MatchList.data,
      show_kills: $routeParams.showKills == "true",
      show_deaths: $routeParams.showDeaths == "true"
    };
    //$scope.$digest();

    console.log("Show Kills: " + $scope.d3Data.show_kills + " Deaths: " + $scope.d3Data.show_deaths);
    console.log($scope);

    KillData.loadPosts($routeParams.summonerName);
    DeathData.loadPosts($routeParams.summonerName);
    MatchList.loadPosts($routeParams.summonerName);
  }

  $scope.go_to_sigma = function() {
    $location.path("heatmaps/sigma/" + $routeParams.summonerName + "/true/false");
  };

  $scope.viewPost = function(postId) { return $location.url('/post/'+postId) };
}]);
