class Performance < ActiveRecord::Base
  belongs_to :summoner
  belongs_to :match

  validates :summoner_id, uniqueness: { scope: :match_id }

  def champ_level=(val)
    self.champion_level = val
  end

  def vision_wards_bought_in_game=(val)
    self.vision_wards_bought = val
  end

  def sight_wards_bought_in_game=(val)
    self.sight_wards_bought = val
  end

end
