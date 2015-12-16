require 'lol'

class HistoryGrabber

  def initialize
    @client = Lol::Client.new ENV['RIOT_API_KEY'], {region: "na"}
  end

  def query_summoner_by_name(name)
    Rails.cache.fetch("#{name}/summoner_by_name", expires_in: 1.hours) do
      @client.summoner.by_name(name)
    end
  end

  def query_champion_name(id)
    Rails.cache.fetch("#{id}/champ_names", expires_in: 30.days) do
      @client.static.champion.get(id).name
    end
  end

  def query_history(id)
    Rails.cache.fetch("#{id}/match_history_by_id", expires_in: 1.hours) do
      @client.match_list.get(id).parsed_response
    end
  end

  def query_match(id)
    Rails.cache.fetch("#{id}/match_stats", expires_in: 1.hours) do
      #@api_counter += 1
      @client.match.get(id).parsed_response
    end
  end

  def get_json(id)
    @api_counter = 0

    id = query_summoner_by_name(id)[0].id

    output = Array.new

    first = query_history(id)["matches"][0]
    match_info = query_match(first["matchId"])
    match_info
  end

  def get_history(id)

    @api_counter = 0

    id = query_summoner_by_name(id)[0].id

    output = Array.new

    query_history(id)["matches"].slice(0,2).each do |match|

      match_info = query_match(match["matchId"])

      if @api_counter == 9
        puts "sleepy"
        sleep 10
        @api_counter = 0
      end

      puts match_info

      #match_info["participantIdentities"].each {|part| puts part["player"]["summonerId"] }
      part_id = match_info["participantIdentities"].select { |part| part["player"]["summonerId"] == id }[0]["participantId"]
      team_id = match_info["participants"].select { |part| part["participantId"] == part_id }[0]["teamId"]
      team_info = match_info["teams"].select { |team| team["teamId"] == team_id }[0]

      match_hash = {:queue => match["queue"],
                 :champion => query_champion_name(match["champion"]),
                 :riot_timestamp => Time.at(match["timestamp"]/1000),
                 :matchid => match["matchId"],
                 :lane => match["lane"],
                 :role => match["role"],
                 :season => match["season"],
                 :platform => match["platformid"],
                 :region => match["region"],
                 }
      match_hash.merge!(team_info)

      #puts match_hash
      @matchrecord = Matchrecord.new(match_hash)
      @matchrecord.save

      output << match_hash

    end
    output
  end

end
