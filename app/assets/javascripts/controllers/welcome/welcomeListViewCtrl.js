

angular.module('mainApp').controller('welcomeListViewCtrl',
['$timeout', '$rootScope', '$scope', '$location', '$http', 'KillData', 'DeathData', 'MatchList', '$stateParams', 'ShareData',
function($timeout, $rootScope, $scope, $location, $http, KillData, DeathData, MatchList, $stateParams, ShareData) {
  console.log("ListViewCtrl FIRE");

  //console.log($stateParams);

  if ($stateParams.summonerName != undefined) {

    if ($stateParams.showDeaths == undefined) {
      if ($stateParams.showKills != undefined) {
        $location.path("/list/" + $stateParams.summonerName + "/" + $stateParams.showKills + "/false");
      }
      else {
        $location.path("/list/" + $stateParams.summonerName + "/true/false");
      }
    }

    //console.log($stateParams.stateParams != undefined);

    $scope.d3Data = {
      summonerName: $stateParams.summonerName,
      kills: KillData.data,
      deaths: DeathData.data,
      matches: MatchList.data,
      controls: ShareData
    };

    //console.log("Show Kills: " + $scope.d3Data.show_kills + " Deaths: " + $scope.d3Data.show_deaths);
    //console.log($scope);

    KillData.loadPosts($stateParams.summonerName);
    DeathData.loadPosts($stateParams.summonerName);
    MatchList.loadPosts($stateParams.summonerName);
  }


  //$timeout(function() { console.log("Timeout checker: " + $scope.d3Data.show_kills + " : " + ShareData.show_kills); return false;}, 3000);

  // $scope.$watch("ShareData.show_kills",
  //                   function(newval, oldval) {
  //                     console.log("Watch trig " + newval + ":" + oldval);
  //                     if (newval != undefined)
  //                       $scope.d3Data.show_kills = newval},
  //                   true);
  //$rootScope.$on("show_kills_updated", function(event, arg) {$scope.d3Data.show_kills = arg; console.log("Rx'd kills " + arg);});

  $scope.go_to_sigma = function() {
    $location.path("heatmaps/sigma/" + $stateParams.summonerName + "/true/false");
  };

  $scope.viewPost = function(postId) { return $location.url('/post/'+postId) };
}]);
