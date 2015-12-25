class DataController < ApplicationController

  def all_kills
    if params.has_key? :id
      summoner_id = params[:id].to_i
    elsif params.has_key? :name
      summoner_id = Summoner.find_by(name: "#{params[:name]}").id
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
        format.json { render json: Summoner.find_by(name: params[:name]).matches.order('match_creation DESC').map{|m| m.id} }
      end
    else
      respond_to do |format|
        format.json { render json: "" }
      end
    end
  end

  def all_match_details
    if params.has_key? :id
      summoner_id = params[:id].to_i
      render_all_match_details(summoner_id)
    elsif params.has_key? :name
      summoner_id = Summoner.find_by(name: "#{params[:name]}").id
      render_all_match_details(summoner_id)
    else
      if params.has_key? :match
        render_match_details(params[:match])
      else
        respond_to do |format|
          format.json { render json: "" }
        end
      end
    end
  end

  def all_performances
    if params.has_key? :name
      if !params.has_key? :match
        perfs = Summoner.find_by(name: params[:name]).performances
        hashed_return = Hash.new
        perfs.each do |p|
          hashed_return[p.match.riot_match_id] = p
        end

        respond_to do |format|
          format.json { render json: hashed_return }
        end
      else
        #perfs = Performance.where(riot_match_id: params[:match]).summoner.where(name: params[:name])
        sid = Summoner.find_by(name: params[:name]).id
        mid = Match.find_by(id: params[:match]).id
        perfs = Performance.find_by(summoner_id: sid, match_id: mid)
        respond_to do |format|
          format.json { render json: perfs }
        end
      end
    end
  end

  def render_all_performances(summoner)
    perfs = Performance.where(summoner_id: summoner)
    hashed_return = Hash.new
    perfs.each do |p|
      hashed_return[p.match_id] = p
    end

    respond_to do |format|
      format.json { render json: hashed_return }
    end
  end

  def render_performance(summoner, match)
    respond_to do |format|
      format.json { render json: Performance.where(summoner_id: summoner, match_id: match).first }
    end
  end

  def render_match_details(matchid)
    respond_to do |format|
      format.json { render json: Match.where(id: "#{matchid}").first }
    end
  end

  def render_all_match_details(summoner)
    match_ids = KillEvent.where(summoner_id: summoner).map {|k| k.match_id}.uniq!
    match_dets = Hash.new
    match_ids.each do |m|
      match_dets[m] = Match.where(riot_match_id: m).first
    end

    respond_to do |format|
      format.json { render json: match_dets }
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
