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
    hg = HistoryGrabber.new

    match_info = hg.query_match(match)
    parts = match_info["participantIdentities"]
    parts_perfs = match_info["participants"]

    match_row = process_match(match_info)

    participant_id_map = Hash.new

    i = 0
    parts.each do |p|
      #puts p["player"]["summonerId"].to_s + " " + p["player"]["summonerName"].to_s
      player = process_player(p)

      participant_id_map[p["participantId"].to_i] = p["player"]["summonerId"].to_i
      this_perf = parts_perfs[i]
      process_performance(player, match_row, this_perf)

      i += 1

    end

    match_info["timeline"]["frames"].each do |frame|
      if frame.has_key? "events"
        frame["events"].map { |e| process_event(e, participant_id_map, match_info) }
      end
    end

    respond_to do |format|
      format.json { render json: match_info }
    end

  end

  def process_match(match_info)
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

    #puts "T1 index: " + team_1_index.to_s
    match_row.winner_team = (match_info["teams"][team_1_index]["winner"])?1:2
    #puts "Winner T: " + match_row.winner_team.to_s
    #puts match_row

    match_row.first_ban_team = (match_info["teams"][team_1_index]["bans"][0]["pickTurn"] == 1)?1:2
    #puts "First ban by team: " + match_row.first_ban_team.to_s

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

  def process_performance(player, match_row, this_perf)
    perf = player.performances.new

    this_stats = this_perf["stats"]

    perf["summoner_id"] = player.riot_id
    perf["match_id"] = match_row.riot_match_id
    perf["team_id"] = this_perf["teamId"]
    perf["spell_1_id"] = this_perf["spell1Id"]
    perf["spell_2_id"] = this_perf["spell2Id"]
    perf["champion_id"] = this_perf["championId"]
    perf["highest_achieved_season_tier"] = this_perf["highestAchievedSeasonTier"]
    perf["creeps_per_min_deltas"] = this_perf["timeline"]["creepsPerMinDeltas"].to_s
    perf["xp_per_min_deltas"] = this_perf["timeline"]["xpPerMinDeltas"].to_s
    perf["gold_per_min_deltas"] = this_perf["timeline"]["goldPerMinDeltas"].to_s
    perf["cs_diff_per_min_deltas"] = this_perf["timeline"]["csDiffPerMinDeltas"].to_s
    perf["xp_diff_per_min_deltas"] = this_perf["timeline"]["xpDiffPerMinDeltas"].to_s
    perf["damage_taken_per_min_deltas"] = this_perf["timeline"]["damageTakenPerMinDeltas"].to_s
    perf["damage_taken_diff_per_min_deltas"] = this_perf["timeline"]["damageTakenDiffPerMinDeltas"].to_s
    perf["role"] = this_perf["timeline"]["role"]
    perf["lane"] = this_perf["timeline"]["lane"]
    perf["mastery_string"] = this_perf["masteries"].to_s
    perf["winner"] = this_stats["winner"]
    perf["champion_level"] = this_stats["champLevel"]
    perf["item_0"] = this_stats["item0"]
    perf["item_1"] = this_stats["item1"]
    perf["item_2"] = this_stats["item2"]
    perf["item_3"] = this_stats["item3"]
    perf["item_4"] = this_stats["item4"]
    perf["item_5"] = this_stats["item5"]
    perf["item_6"] = this_stats["item6"]
    perf["kills"] = this_stats["kills"]
    perf["double_kills"] = this_stats["doubleKills"]
    perf["triple_kills"] = this_stats["tripleKills"]
    perf["quadra_kills"] = this_stats["quadraKills"]
    perf["penta_kills"] = this_stats["pentaKills"]
    perf["unreal_kills"] = this_stats["unrealKills"]
    perf["largest_killing_spree"] = this_stats["largestKillingSpree"]
    perf["deaths"] = this_stats["deaths"]
    perf["assists"] = this_stats["assists"]
    perf["total_damage_dealt"] = this_stats["totalDamageDealt"]
    perf["total_damage_dealt_to_champions"] = this_stats["totalDamageDealtToChampions"]
    perf["total_damage_taken"] = this_stats["totalDamageTaken"]
    perf["largest_critical_strike"] = this_stats["largestCriticalStrike"]
    perf["total_heal"] = this_stats["totalHeal"]
    perf["minions_killed"] = this_stats["minionsKilled"]
    perf["neutral_minions_killed"] = this_stats["neutralMinionsKilled"]
    perf["neutral_minions_killed_team_jungle"] = this_stats["neutralMinionsKilledTeamJungle"]
    perf["neutral_minions_killed_enemey_jungle"] = this_stats["neutralMinionsKilledEnemyJungle"]
    perf["gold_earned"] = this_stats["goldEarned"]
    perf["gold_spent"] = this_stats["goldSpent"]
    perf["combat_player_score"] = this_stats["combatPlayerScore"]
    perf["objective_player_score"] = this_stats["objectivePlayerScore"]
    perf["total_player_score"] = this_stats["totalPlayerScore"]
    perf["total_score_rank"] = this_stats["totalScoreRank"]
    perf["magic_damage_dealt_to_champions"] = this_stats["magicDamageDealtToChampions"]
    perf["physical_damage_dealt_to_champions"] = this_stats["physicalDamageDealtToChampions"]
    perf["true_damage_dealt_to_champions"] = this_stats["trueDamageDealtToChampions"]
    perf["vision_wards_bought"] = this_stats["visionWardsBoughtInGame"]
    perf["sight_wards_bought"] = this_stats["sightWardsBoughtInGame"]
    perf["magic_damage_dealt"] = this_stats["magicDamageDealt"]
    perf["physical_damage_dealt"] = this_stats["physicalDamageDealt"]
    perf["true_damage_dealt"] = this_stats["trueDamageDealt"]
    perf["magic_damage_taken"] = this_stats["magicDamageTaken"]
    perf["physical_damage_taken"] = this_stats["physicalDamageTaken"]
    perf["true_damage_taken"] = this_stats["trueDamageTaken"]
    perf["first_blood_kill"] = this_stats["firstBloodKill"]
    perf["first_blood_assist"] = this_stats["firstBloodAssist"]
    perf["first_tower_kill"] = this_stats["firstTowerKill"]
    perf["first_tower_assist"] = this_stats["firstTowerAssist"]
    perf["first_inhibitor_kill"] = this_stats["firstInhibitorKill"]
    perf["first_inhibitor_assist"] = this_stats["firstInhibitorAssist"]
    perf["inhibitor_kills"] = this_stats["inhibitorKills"]
    perf["tower_kills"] = this_stats["towerKills"]
    perf["wards_placed"] = this_stats["wardsPlaced"]
    perf["wards_killed"] = this_stats["wardsKilled"]
    perf["largest_multi_kill"] = this_stats["largestMultiKill"]
    perf["killing_sprees"] = this_stats["killingSprees"]
    perf["total_units_healed"] = this_stats["totalUnitsHealed"]
    perf["total_time_crowd_control_dealt"] = this_stats["totalTimeCrowdControlDealt"]
    perf["participant_id"] = this_perf["participantId"]
    perf["rune_string"] = this_perf["runes"].to_s

    perf.save
  end

  def process_player(p)
    player = Summoner.new
    player.name = p["player"]["summonerName"]
    player.riot_id = p["player"]["summonerId"].to_i
    player.save
    player
  end

  def process_event(event, participant_id_map, match_info)
    if event["eventType"] == "CHAMPION_KILL"
      add_champ_kill(event, participant_id_map, match_info)
    end

    if event["eventType"] == "WARD_PLACED"
      add_ward_place(event, participant_id_map, match_info)
    end

    if event["eventType"] == "WARD_KILL"
      add_ward_kill(event, participant_id_map, match_info)
    end
  end

  def add_champ_kill(event, participant_id_map, match_info)
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

  def add_ward_kill(event, participant_id_map, match_info)
    w = WardEvent.new
    w.summoner_id = participant_id_map[event["killerId"]]
    w.match_id = match_info["matchId"].to_i
    w.riot_timestamp = event["timestamp"]
    w.ward_type = event["wardType"]
    w.event_type = "KILL"
    w.save
  end

  def add_ward_place(event, participant_id_map, match_info)
    w = WardEvent.new
    w.summoner_id = participant_id_map[event["creatorId"]]
    w.match_id = match_info["matchId"].to_i
    w.riot_timestamp = event["timestamp"]
    w.ward_type = event["wardType"]
    w.event_type = "PLACE"
    w.save
  end

  def index
  end

end
