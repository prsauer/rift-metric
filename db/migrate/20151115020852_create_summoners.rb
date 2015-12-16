class CreateSummoners < ActiveRecord::Migration
  def change
    create_table :summoners do |t|
      t.string :name
      t.integer :riot_id
      t.timestamps null: false
    end

    create_table :matches do |t|
      t.integer :riot_match_id
      t.string  :region
      t.string  :platform
      t.string  :match_mode
      t.string  :match_type
      t.string  :match_creation
      t.integer :match_duration
      t.string  :queue_type
      t.integer :map_id
      t.string  :season
      t.string  :match_version
      t.integer :winner_team
      t.integer :first_ban_team
      t.integer :first_blood_team
      t.integer :first_tower_team
      t.integer :first_inhibitor_team
      t.integer :first_baron_team
      t.integer :first_dragon_team
      t.integer :team1_tower_kills
      t.integer :team1_inhibitor_kills
      t.integer :team1_baron_kills
      t.integer :team1_dragon_kills
      t.integer :team1_vilemaw_kills
      t.integer :team1_dominion_victory_score
      t.integer :team2_tower_kills
      t.integer :team2_inhibitor_kills
      t.integer :team2_baron_kills
      t.integer :team2_dragon_kills
      t.integer :team2_vilemaw_kills
      t.integer :team2_dominion_victory_score
      t.integer :team1_ban1
      t.integer :team1_ban2
      t.integer :team1_ban3
      t.integer :team2_ban1
      t.integer :team2_ban2
      t.integer :team2_ban3

      t.timestamps null: false
    end

    create_table :performances do |t|
      t.integer :summoner_id
      t.integer :match_id
      t.integer :team_id
      t.integer :spell_1_id
      t.integer :spell_2_id
      t.integer :champion_id
      t.string :highest_achieved_season_tier
      t.string :creeps_per_min_deltas
      t.string :xp_per_min_deltas
      t.string :gold_per_min_deltas
      t.string :cs_diff_per_min_deltas
      t.string :xp_diff_per_min_deltas
      t.string :damage_taken_per_min_deltas
      t.string :damage_taken_diff_per_min_deltas
      t.string :role
      t.string :lane
      t.string :mastery_string
      t.boolean :winner
      t.integer :champion_level
      t.integer :item_0
      t.integer :item_1
      t.integer :item_2
      t.integer :item_3
      t.integer :item_4
      t.integer :item_5
      t.integer :item_6
      t.integer :kills
      t.integer :double_kills
      t.integer :triple_kills
      t.integer :quadra_kills
      t.integer :penta_kills
      t.integer :unreal_kills
      t.integer :largest_killing_spree
      t.integer :deaths
      t.integer :assists
      t.integer :total_damage_dealt
      t.integer :total_damage_dealt_to_champions
      t.integer :total_damage_taken
      t.integer :largest_critical_strike
      t.integer :total_heal
      t.integer :minions_killed
      t.integer :neutral_minions_killed
      t.integer :neutral_minions_killed_team_jungle
      t.integer :neutral_minions_killed_enemey_jungle
      t.integer :gold_earned
      t.integer :gold_spent
      t.integer :combat_player_score
      t.integer :objective_player_score
      t.integer :total_player_score
      t.integer :total_score_rank
      t.integer :magic_damage_dealt_to_champions
      t.integer :physical_damage_dealt_to_champions
      t.integer :true_damage_dealt_to_champions
      t.integer :vision_wards_bought
      t.integer :sight_wards_bought
      t.integer :magic_damage_dealt
      t.integer :physical_damage_dealt
      t.integer :true_damage_dealt
      t.integer :magic_damage_taken
      t.integer :physical_damage_taken
      t.integer :true_damage_taken
      t.boolean :first_blood_kill
      t.boolean :first_blood_assist
      t.boolean :first_tower_kill
      t.boolean :first_tower_assist
      t.boolean :first_inhibitor_kill
      t.boolean :first_inhibitor_assist
      t.integer :inhibitor_kills
      t.integer :tower_kills
      t.integer :wards_placed
      t.integer :wards_killed
      t.integer :largest_multi_kill
      t.integer :killing_sprees
      t.integer :total_units_healed
      t.integer :total_time_crowd_control_dealt
      t.integer :participant_id
      t.string :rune_string

      t.timestamps null: false
    end

    create_table :kill_events do |t|
      t.integer :summoner_id
      t.integer :match_id
      t.integer :riot_timestamp
      t.integer :pos_x
      t.integer :pos_y
      t.integer :victim_id
      t.integer :killer_id
      t.string  :assists
      t.timestamps null: false
    end
  end

end
