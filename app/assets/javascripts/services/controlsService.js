angular.module('mainApp').factory('ControlsData', [
function () {
  var data = {
    show_kills: true,
    show_deaths: false,
    summonerName: ""
  };
  return data;
}
]);
