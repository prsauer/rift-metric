angular.module('d3',[]);

angular.module('mainApp',['ngRoute', 'd3']);
angular.module('mainApp')
  .config(function($routeProvider) {
      $routeProvider.when('/heatmaps/list/:summonerName?/:showKills?/:showDeaths?',            { templateUrl: '../assets/welcomeListView.html',    controller: 'welcomeListViewCtrl'});
      $routeProvider.when('/heatmaps/details/:summonerName/:matchId/:showKills?/:showDeaths?', { templateUrl: '../assets/welcomeDetailsView.html', controller: 'welcomeDetailsCtrl'});
      $routeProvider.otherwise(    { templateUrl: '../assets/welcomeIndex.html', controller: 'IndexCtrl'});
    }
  );
