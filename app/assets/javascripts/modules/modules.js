angular.module('d3',[]);

angular
.module('mainApp',['d3', 'ui.router', 'ngAnimate', 'templates'])
.run(
             ['$rootScope', '$state', '$stateParams',
      function($rootScope, $state, $stateParams) {
        console.log("mainApp MODULE INIT");
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
      }])
  .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {

      $stateProvider
        .state("home", {
          url: '/',
          templateUrl: 'assets/welcomeListView.html',
          controller: 'welcomeListViewCtrl',
          controllerAs: "list_ctrl"
        })

        .state("listView", {
          url: '/heatmaps/list/{summonerName}/{showKills}/{showDeaths}',
          views: {
            "controls": {
              templateUrl: "assets/welcomeControlsBar.html",
              controller: "welcomeControlsCtrl",
              controllerAs: "control_ctrl"
            },
            "graph": {
              templateUrl: "assets/welcomeListView.html",
              controller: "welcomeListViewCtrl",
              controllerAs: "list_ctrl"
            }
          }
        })

        .state("detailsView", {
          url: '/heatmaps/details/{summonerName}/{matchId}/{showKills}/{showDeaths}',
          views: {
            "controls": {
              templateUrl: "assets/welcomeControlsBar.html",
              controller: "welcomeControlsCtrl",
              controllerAs: "control_ctrl"
            },
            "graph": {
              templateUrl: "assets/welcomeDetailsView.html",
              controller: "welcomeDetailsCtrl",
              controllerAs: "details_ctrl"
            }
          }
        })

        .state("sigmaView", {
          url: '/heatmaps/sigma/{summonerName}/{showKills}/{showDeaths}',
          views: {
            "controls": {
              templateUrl: "assets/welcomeControlsBar.html",
              controller: "welcomeControlsCtrl",
              controllerAs: "control_ctrl"
            },
            "graph": {
              templateUrl: "assets/welcomeSigmaView.html",
              controller: "welcomeSigmaCtrl",
              controllerAs: "sigma_ctrl"
            }
          }
        })

        .state('contacts', {
          template: '<h1>My Contacts</h1>'
        });

      $locationProvider.html5Mode(true);

    }
  ]);
