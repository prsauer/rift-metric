Rails.application.routes.draw do

  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"

  get 'data/all_kills', to: 'data#all_kills'
  get 'data/all_wards', to: 'data#all_wards'
  get 'data/all_deaths', to: 'data#all_deaths'
  get 'data/match_id_list', to: 'data#match_id_list'
  get 'data/match_details', to: 'data#all_match_details'
  get 'data/match_perf', to: 'data#all_performances'

  get 'gather/match_details', to: 'gather#match_details'
  get 'gather/index', to: 'gather#index'

  root 'welcome#index'
  get '/*path.html', to: 'welcome#index', layout: 0
  get '/*path', to: 'welcome#index'
end
