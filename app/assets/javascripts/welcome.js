
//= require_self
//= require_tree ./modules
//= require_tree ./services
//= require_tree ./directives
//= require_tree ./controllers/welcome

function on_search_click() {
  window.location.href = 'heatmaps/list/' + $("#name_submission_text").val() + '/true/false';
  return true;
}
