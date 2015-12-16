angular.module('mainApp').factory('DeathData', ['$http',
function ($http) {
  var deathData = {
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

  deathData.loadPosts = function(summonerName) {
      $http.get('./data/all_deaths.json?name=' + summonerName).success(function(data) {
      deathData.data.matches = data;
      //console.log($scope.data.posts);
      return console.log("Loaded data");
    }).error(function() {
      return console.error("Failed to get data!");
    });
  };

  console.log("Init DeathData service");
  return deathData;
}
]);
