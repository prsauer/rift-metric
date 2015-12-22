angular.module('mainApp').factory('DataService', ['$http', '$q',
function ($http, $q, $scope) {
  var dataService = {

    match_ids: {},
    details: {},
    performances: {},
    kills: {},
    deaths: {},

    match_ids_has_loaded: false,
    details_have_loaded: {},
    performance_has_loaded: {},
    kills_have_loaded: {},
    deaths_have_loaded: {},

    sigma_deaths: false,
    sigma_kills: false,
  };

  dataService.gatherSigmaDeaths = function(summonerName) {
    var d = $q.defer();
      //if (!dataService.deaths_have_loaded.hasOwnProperty(matchid)) {
        $http.get('./data/all_deaths.json?name=' + summonerName ).success(function(data) {

          data.forEach(function(ele) {
            if (
            !dataService.deaths_have_loaded.hasOwnProperty(ele.match_id) ||
            (dataService.deaths_have_loaded.hasOwnProperty(ele.match_id) && !dataService.deaths_have_loaded[ele.match_id])
            )
            {
              if (dataService.deaths.hasOwnProperty(ele.match_id)) {
                dataService.deaths[ele.match_id].push(ele);
              }
              else {
                dataService.deaths[ele.match_id] = [ele];
              }
            }
          });

          data.forEach(function(ele) {
            dataService.deaths_have_loaded[ele.match_id] = true;
          });

          d.resolve(data);
          dataService.sigma_deaths = true;
          //console.log("Loaded gatherSigma_deaths " + summonerName );
          //console.log(dataService);
        }).error(function() {
          return console.error("Failed to get data! " + summonerName );
        });
      //}
      //else {
      //  d.resolve();
      //}
      return d.promise;
  };

  dataService.gatherSigmaKills = function(summonerName) {
    var d = $q.defer();
      //if (!dataService.kills_have_loaded.hasOwnProperty(matchid)) {
        $http.get('./data/all_kills.json?name=' + summonerName ).success(function(data) {
          data.forEach(function(ele) {
            if (
            !dataService.kills_have_loaded.hasOwnProperty(ele.match_id) ||
            (dataService.kills_have_loaded.hasOwnProperty(ele.match_id) && !dataService.kills_have_loaded[ele.match_id])
            )
            {
              if (dataService.kills.hasOwnProperty(ele.match_id)) {
                dataService.kills[ele.match_id].push(ele);
              }
              else {
                dataService.kills[ele.match_id] = [ele];
              }
            }
          });

          data.forEach(function(ele) {
            dataService.kills_have_loaded[ele.match_id] = true;
          });

          d.resolve(data);
          dataService.sigma_kills = true;
          //console.log("Loaded gatherSigma_kills " + summonerName );
        }).error(function() {
          return console.error("Failed to get data! " + summonerName );
        });
      //}
      //else {
      //  d.resolve();
      //}
      return d.promise;
  };

  dataService.gatherDeaths = function(summonerName, matchid) {
    var d = $q.defer();
      if (!dataService.deaths_have_loaded.hasOwnProperty(matchid)) {
        $http.get('./data/all_deaths.json?name=' + summonerName + "&match=" + matchid).success(function(data) {
          dataService.deaths[matchid] = data;
          d.resolve(data);
          dataService.deaths_have_loaded[matchid] = true;
          //console.log("Loaded gatherDeaths " + summonerName + ", " + matchid);
        }).error(function() {
          return console.error("Failed to get data! " + summonerName + ", " + matchid );
        });
      }
      else {
        d.resolve();
      }
      return d.promise;
  };

  dataService.gatherKills = function(summonerName, matchid) {
    var d = $q.defer();
    if (!dataService.kills_have_loaded.hasOwnProperty(matchid)) {
        $http.get('./data/all_kills.json?name=' + summonerName + "&match=" + matchid).success(function(data) {
          dataService.kills[matchid] = data;
          d.resolve(data);
          dataService.kills_have_loaded[matchid] = true;
          //console.log("Loaded gatherKills " + summonerName + ", " + matchid);
        }).error(function() {
          return console.error("Failed to get data! " + summonerName + ", " + matchid );
        });
    }
    else {
      d.resolve();
    }
    return d.promise;
  };

  dataService.gatherDetails = function(matchid) {
    var d = $q.defer();
    if (!dataService.details_have_loaded.hasOwnProperty(matchid)) {
      $http.get('./data/match_details.json?&match=' + matchid).success(function(data) {
        dataService.details[matchid] = data;
        d.resolve(data);
        dataService.details_have_loaded[matchid] = true;
        //console.log("Loaded gatherPerformance " + summonerName + ", " + matchid);
      }).error(function() {
        return console.error("Failed to get data! " + matchid );
      });
    }
    else {
      d.resolve();
    }
    return d.promise;
  };

  dataService.gatherPerformance = function(summonerName, matchid) {
    var d = $q.defer();
    if (!dataService.performance_has_loaded.hasOwnProperty(matchid)) {
      $http.get('./data/match_perf.json?name=' + summonerName + "&match=" + matchid).success(function(data) {
        dataService.performances[matchid] = data;
        d.resolve(data);
        dataService.performance_has_loaded[matchid] = true;
        //console.log("Loaded gatherPerformance " + summonerName + ", " + matchid);
      }).error(function() {
        return console.error("Failed to get data! " + summonerName + ", " + matchid );
      });
    }
    else {
      d.resolve();
    }
    return d.promise;
  };

  dataService.gatherMatchIds = function(summonerName) {
    var d = $q.defer();
    if (!dataService.match_ids_has_loaded) {
      $http.get('./data/match_id_list.json?name=' + summonerName).success(function(data) {
        dataService.match_ids = data;
        d.resolve(data);
        dataService.match_ids_have_loaded = true;
        console.log("Loaded gatherMatchIds for " + summonerName);
      }).error(function() {
        return console.error("Failed to get data!");
      });
    }
    else {
      d.resolve();
    }
    return d.promise;
  }


  console.log("Init DataService service");
  return dataService;
}
]);
