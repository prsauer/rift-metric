angular.module('d3',[]);

angular.module('mainApp',['d3', 'ui.router', 'ngAnimate', 'templates'])
  .run(['$rootScope', '$state', '$stateParams',
      function($rootScope, $state, $stateParams) {
        console.log("mainApp MODULE INIT");
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
      }])
  .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {
      //$routeProvider.when('/heatmaps/list/:summonerName?/:showKills?/:showDeaths?',            { templateUrl: '../assets/welcomeListView.html',    controller: 'welcomeListViewCtrl'});
      //$routeProvider.when('/heatmaps/details/:summonerName/:matchId/:showKills?/:showDeaths?', { templateUrl: '../assets/welcomeDetailsView.html', controller: 'welcomeDetailsCtrl'});
      //$routeProvider.when('/heatmaps/sigma/:summonerName/:showKills?/:showDeaths?', { templateUrl: '../assets/welcomeSigmaView.html', controller: 'welcomeSigmaCtrl'});
      //$routeProvider.otherwise(    { templateUrl: '../assets/welcomeIndex.html', controller: 'IndexCtrl'});
      //$urlRouterProvider
      //  .when('/')

      $stateProvider

      .state("home", {
        url: '/',
        //template: 'assets/welcomeListView.html'
        templateUrl: 'assets/welcomeListView.html',
        controller: 'welcomeListViewCtrl'
      })

      .state("listView", {
        url: '/heatmaps/list/{summonerName}/{showKills}/{showDeaths}',
        //template: 'assets/welcomeListView.html'
        //templateUrl: 'assets/welcomeListView.html',
        //controller: 'welcomeListViewCtrl'
        views: {
          "controls": {
            templateUrl: "assets/welcomeControlsBar.html",
            controller: "welcomeControlsCtrl"
          },
          "graph": {
            templateUrl: "assets/welcomeListView.html",
            controller: "welcomeListViewCtrl"
          }
        }
      })

      .state("detailsView", {
        url: '/heatmaps/details/{summonerName}/{matchId}/{showKills}/{showDeaths}',
        //template: 'assets/welcomeListView.html'
        views: {
          "controls": {
            templateUrl: "assets/welcomeControlsBar.html",
            controller: "welcomeControlsCtrl"
          },
          "graph": {
            templateUrl: "assets/welcomeDetailsView.html",
            controller: "welcomeDetailsCtrl"
          }
        }
      })

      .state("sigmaView", {
        url: '/heatmaps/sigma/{summonerName}/{showKills}/{showDeaths}',
        //template: 'assets/welcomeListView.html'
        views: {
          "controls": {
            templateUrl: "assets/welcomeControlsBar.html",
            controller: "welcomeControlsCtrl"
          },
          "graph": {
            templateUrl: "assets/welcomeSigmaView.html",
            controller: "welcomeSigmaCtrl"
          }
        }
      })

      .state('contacts', {
        template: '<h1>My Contacts</h1>'
      });

      //$urlRouterProvider.otherwise('/');

      $locationProvider.html5Mode(true);

    }
  ]);
