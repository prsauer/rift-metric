
//= require_self
//= require champion_gdata.js
//= require_tree ./modules
//= require_tree ./services
//= require_tree ./directives
//= require_tree ./controllers/welcome

function on_search_click(e) {
  event.preventDefault();
  window.location.href = '/heatmaps/list/' + $("#name_submission_text").val() + '/true/false';
  return false;
}
