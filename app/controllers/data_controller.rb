class DataController < ApplicationController

  def all_kills
    if params.has_key? :id
      summoner_id = params[:id].to_i
    elsif params.has_key? :name
      summoner_id = Summoner.where(name: "#{params[:name]}").first.riot_id
    else
      respond_to do |format|
        format.json { render json: "" }
      end
    end

    if params.has_key? :match
      render_match_kills(summoner_id, params[:match])
    elsif
      render_all_kills(summoner_id)
    end

  end

  def all_deaths
    if params.has_key? :id
      summoner_id = params[:id].to_i
    elsif params.has_key? :name
      summoner_id = Summoner.where(name: "#{params[:name]}").first.riot_id
    else
      respond_to do |format|
        format.json { render json: "" }
      end
    end

    if params.has_key? :match
      render_match_deaths(summoner_id, params[:match])
    elsif
      render_all_deaths(summoner_id)
    end
  end

  def all_wards
    if params.has_key? :id
      summoner_id = params[:id].to_i
    elsif params.has_key? :name
      summoner_id = Summoner.where(name: "#{params[:name]}").first.riot_id
    else
      respond_to do |format|
        format.json { render json: "" }
      end
    end

    if params.has_key? :match
      render_match_wards(summoner_id, params[:match])
    elsif
      render_all_wards(summoner_id)
    end
  end

  def match_id_list
    if params.has_key? :name
      respond_to do |format|
        summoner_id = Summoner.where(name: "#{params[:name]}").first.riot_id
        format.json { render json: KillEvent.where(summoner_id: "#{summoner_id}").map {|k| k.match_id}.uniq! }
      end
    elsif params.has_key? :id
      respond_to do |format|
        format.json { render json: KillEvent.where(summoner_id: "#{params[:id].to_i}").map {|k| k.match_id}.uniq! }
      end
    else
      respond_to do |format|
        format.json { render json: "" }
      end
    end
  end

  def render_all_wards(summoner)
    respond_to do |format|
      format.json { render json: WardEvent.where(summoner_id: "#{summoner}").collect }
    end
  end

  def render_match_wards(summoner, match)
    respond_to do |format|
      format.json { render json: WardEvent.where(summoner_id: "#{summoner}", match_id: "#{match}").collect }
    end
  end

  def render_all_kills(summoner)
    respond_to do |format|
      format.json { render json: KillEvent.where(summoner_id: "#{summoner}").collect }
    end
  end

  def render_match_kills(summoner, match)
    respond_to do |format|
      format.json { render json: KillEvent.where(summoner_id: "#{summoner}", match_id: "#{match}").collect }
    end
  end

  def render_all_deaths(summoner)
    respond_to do |format|
      format.json { render json: KillEvent.where(victim_id: "#{summoner}").collect }
    end
  end

  def render_match_deaths(summoner, match)
    respond_to do |format|
      format.json { render json: KillEvent.where(victim_id: "#{summoner}", match_id: "#{match}").collect }
    end
  end

end
