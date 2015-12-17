angular.module('mainApp').factory('ShareData', [
function () {
  var data = {
    show_kills: true,
    show_deaths: false
  };
  return data;
}
]);
