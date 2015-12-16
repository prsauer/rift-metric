class KillEvent < ActiveRecord::Base
  belongs_to :summoner
  belongs_to :match

  validates :summoner_id, presence: true
  validates :match_id, presence: true
  validates :riot_timestamp, presence: true
  validates :pos_x, presence: true
  validates :pos_y, presence: true
  validates :victim_id, presence: true
  validates :victim_id, uniqueness: { scope: :riot_timestamp }
  validates :killer_id, presence: true
  
end
