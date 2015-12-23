class WelcomeController < ApplicationController

  # GET /welcome
  def index
    render layout: layout_name
  end

  def layout_name
    if params[:layout] == 0
      false
    else
      'application'
    end
  end

end
