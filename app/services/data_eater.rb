
class DataEater

  def self.camel_to_underscore(pat)
    pat.chars.inject { |memo, c| (c.upcase == c)?(memo + "_" + c.downcase):(memo + c) }
  end

  def eat_match(matchid)
    hg = HistoryGrabber.new

    match_info = hg.query_match(matchid)

    match_row = eat_details(match_info)

    participant_id_map = Hash.new

    i = 0
    
    match_info["participantIdentities"].each do |p|

      player = eat_player(p)

      participant_id_map[p["participantId"].to_i] = p["player"]["summonerId"].to_i
      this_perf = match_info["participants"][i]
      eat_performance(player, match_row, this_perf)

      i += 1

    end

    match_info["timeline"]["frames"].each do |frame|
      if frame.has_key? "events"
        frame["events"].map { |e| eat_event(e, participant_id_map, match_info) }
      end
    end

    match_info

  end

  def eat_player(p)
    if Summoner.exists?(riot_id: p["player"]["summonerId"].to_i)
      Summoner.find_by riot_id: p["player"]["summonerId"]
    else
      player = Summoner.new
      player.name = p["player"]["summonerName"]
      player.riot_id = p["player"]["summonerId"].to_i
      player.save
      player
    end
  end

  def eat_event(event, participant_id_map, match_info)
    if event["eventType"] == "CHAMPION_KILL"
      eat_champ_kill(event, participant_id_map, match_info)
    end

    #if event["eventType"] == "WARD_PLACED"
      #add_ward_place(event, participant_id_map, match_info)
    #end

    #if event["eventType"] == "WARD_KILL"
      #add_ward_kill(event, participant_id_map, match_info)
    #end
  end

  def eat_details(match_info)
    match_row = Match.new
    match_row.riot_match_id = match_info["matchId"].to_i
    match_row.region = match_info["region"]
    match_row.platform = match_info["platformId"]
    match_row.match_mode = match_info["matchMode"]
    match_row.match_type = match_info["matchType"]
    match_row.match_creation = match_info["matchCreation"]
    match_row.match_duration = match_info["matchDuration"].to_i
    match_row.queue_type = match_info["queueType"]
    match_row.map_id = match_info["mapId"].to_i
    match_row.season = match_info["season"]
    match_row.match_version = match_info["matchVersion"]

    team_1_index = (match_info["teams"][0]["teamId"] == 100)?0:1
    team_2_index = (team_1_index == 0)?1:0

    match_row.winner_team = (match_info["teams"][team_1_index]["winner"])?1:2

    match_row.first_ban_team = (match_info["teams"][team_1_index]["bans"][0]["pickTurn"] == 1)?1:2

    match_row.first_blood_team = (match_info["teams"][team_1_index]["firstBlood"])?1:2
    match_row.first_tower_team = (match_info["teams"][team_1_index]["firstTower"])?1:2
    match_row.first_inhibitor_team = (match_info["teams"][team_1_index]["firstInhibitor"])?1:2
    match_row.first_baron_team = (match_info["teams"][team_1_index]["firstBaron"])?1:2
    match_row.first_dragon_team = (match_info["teams"][team_1_index]["firstDragon"])?1:2

    match_row.team1_tower_kills = match_info["teams"][team_1_index]["towerKills"]
    match_row.team1_inhibitor_kills = match_info["teams"][team_1_index]["inhibitorKills"]
    match_row.team1_baron_kills = match_info["teams"][team_1_index]["baronKills"]
    match_row.team1_dragon_kills = match_info["teams"][team_1_index]["dragonKills"]
    match_row.team1_vilemaw_kills = match_info["teams"][team_1_index]["vilemawKills"]
    match_row.team1_dominion_victory_score = match_info["teams"][team_1_index]["dominionVictoryScore"]

    match_row.team2_tower_kills = match_info["teams"][team_2_index]["towerKills"]
    match_row.team2_inhibitor_kills = match_info["teams"][team_2_index]["inhibitorKills"]
    match_row.team2_baron_kills = match_info["teams"][team_2_index]["baronKills"]
    match_row.team2_dragon_kills = match_info["teams"][team_2_index]["dragonKills"]
    match_row.team2_vilemaw_kills = match_info["teams"][team_2_index]["vilemawKills"]
    match_row.team2_dominion_victory_score = match_info["teams"][team_2_index]["dominionVictoryScore"]

    team_1_bans = match_info["teams"][team_1_index]["bans"]
    team_2_bans = match_info["teams"][team_2_index]["bans"]

    match_row.team1_ban1 = (team_1_bans.size > 0)?team_1_bans[0]["championId"]:nil
    match_row.team1_ban2 = (team_1_bans.size > 1)?team_1_bans[1]["championId"]:nil
    match_row.team1_ban3 = (team_1_bans.size > 2)?team_1_bans[2]["championId"]:nil

    match_row.team2_ban1 = (team_2_bans.size > 0)?team_2_bans[0]["championId"]:nil
    match_row.team2_ban2 = (team_2_bans.size > 1)?team_2_bans[1]["championId"]:nil
    match_row.team2_ban3 = (team_2_bans.size > 2)?team_2_bans[2]["championId"]:nil

    match_row.save

    match_row
  end

  def eat_performance(player, match_row, this_perf)
    perf = player.performances.new

    #perf["summoner_id"] = player.riot_id
    perf["match_id"] = Match.find_by(riot_match_id: match_row.riot_match_id).id

    this_perf["stats"].keys().each do |key|
      underscored_key = DataEater.camel_to_underscore(key)
      perf.send(underscored_key + "=", this_perf["stats"][key])
    end

    this_perf["timeline"].keys().each do |key|
      underscored_key = DataEater.camel_to_underscore(key)

      if key[-1] == 's'
        perf.send(underscored_key + "=", this_perf["timeline"][key].to_s)
      else
        perf.send(underscored_key + "=", this_perf["timeline"][key])
      end
    end

    this_perf.keys().each do |key|
      case key
      when "timeline", "stats"
        next
      when "runes"
        perf["rune_string"] = this_perf[key].to_s
      when "masteries"
        perf["mastery_string"] = this_perf[key].to_s
      else
        underscored_key = DataEater.camel_to_underscore(key)
        perf.send(underscored_key + "=", this_perf[key])
      end
    end
    perf.save

  end

  def eat_champ_kill(event, participant_id_map, match_info)
    k = KillEvent.new
    k.summoner_id = participant_id_map[event["killerId"]]
    k.match_id = match_info["matchId"].to_i
    k.riot_timestamp = event["timestamp"]
    k.pos_x = event["position"]["x"]
    k.pos_y = event["position"]["y"]
    k.victim_id = participant_id_map[event["victimId"]]
    k.killer_id = participant_id_map[event["killerId"]]
    k.assists = event["assistingParticipantIds"].to_s
    k.save
  end

end
