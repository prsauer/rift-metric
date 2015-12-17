angular.module('mainApp').factory('MatchList', ['$http',
function ($http) {
  var matchList = {
    data: {
      matches: [
        1,
        2
      ]
    }
  };

  matchList.loadPosts = function(summonerName) {
      $http.get('./data/match_id_list.json?name=' + summonerName).success(function(data) {
      matchList.data.matches = data;
      //console.log($scope.data.posts);
      //return console.log("Loaded data");
    }).error(function() {
      return console.error("Failed to get data!");
    });
  };

  console.log("Init MatchData service");
  return matchList;
}
]);
