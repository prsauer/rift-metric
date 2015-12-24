class Match < ActiveRecord::Base
  has_many :performances
  has_many :summoners, :through => :performances
  
  validates :riot_match_id, uniqueness: true
  validates :riot_match_id, presence: true
  validates :region, presence: true
  validates :platform, presence: true
  validates :match_mode, presence: true
  validates :match_type, presence: true
  validates :match_creation, presence: true
  validates :match_duration, presence: true
  validates :queue_type, presence: true
  validates :map_id, presence: true
  validates :season, presence: true
  validates :match_version, presence: true
  validates :winner_team, presence: true
  validates :first_ban_team, presence: true
  validates :first_blood_team, presence: true
  validates :first_tower_team, presence: true
  validates :first_inhibitor_team, presence: true
  validates :first_baron_team, presence: true
  validates :first_dragon_team, presence: true
  validates :team1_tower_kills, presence: true
  validates :team1_inhibitor_kills, presence: true
  validates :team1_baron_kills, presence: true
  validates :team1_dragon_kills, presence: true
  validates :team1_vilemaw_kills, presence: true
  validates :team1_dominion_victory_score, presence: true
  validates :team2_tower_kills, presence: true
  validates :team2_inhibitor_kills, presence: true
  validates :team2_baron_kills, presence: true
  validates :team2_dragon_kills, presence: true
  validates :team2_vilemaw_kills, presence: true
  validates :team2_dominion_victory_score, presence: true
  #validates :team1_ban1, presence: true
  #validates :team1_ban2, presence: true
  #validates :team1_ban3, presence: true
  #validates :team2_ban1, presence: true
  #validates :team2_ban2, presence: true
  #validates :team2_ban3, presence: true

  def method_missing(m, *args, &block)
    puts "MISSING " + m.to_s
  end

end
