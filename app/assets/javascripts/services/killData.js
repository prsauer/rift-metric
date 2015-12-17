angular.module('mainApp').factory('KillData', ['$http',
function ($http) {
  var killData = {
    data: {
      matches: [
        {
          match_id: 100,
          kill_pos: [ [0,0], [1,1], [2,2] ]
        },
        {
          match_id: 200,
          kill_pos: [ [1,10], [1,1], [2,2] ]
        }
      ]
    }
  };

  killData.loadPosts = function(summonerName) {
      $http.get('./data/all_kills.json?name='+summonerName).success(function(data) {
      killData.data.matches = data;
      //console.log($scope.data.posts);
      //return console.log("Loaded data");
    }).error(function() {
      return console.error("Failed to get data!");
    });
  };

  console.log("Init KillData service");
  return killData;
}
]);
