class GatherController < ApplicationController

  def match_list
    if params.has_key? :name
      hg = HistoryGrabber.new
      id = hg.query_summoner_by_name(params[:name])[0].id
      respond_to do |format|
        format.json { render json: hg.query_history(id)["matches"].map { |m| m["matchId"]}.collect.to_a }
      end
    else
      respond_to do |format|
        format.json { render json: "" }
      end
    end
  end

  def match_details
    if params.has_key?(:match)
      if Match.exists?(riot_match_id: params[:match])
        respond_to do |format|
          format.json { render json: Match.where(riot_match_id: params[:match]).first }
        end
      else
        render_details(params[:match])
      end
    else
      respond_to do |format|
        format.json { render json: "" }
      end
    end
  end

  def render_details(match)

    eater = DataEater.new
    match_info = eater.eat_match(match)
    
    respond_to do |format|
      format.json { render json: match_info }
    end

  end

  def index
  end

end
