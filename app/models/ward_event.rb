class WardEvent < ActiveRecord::Base
  belongs_to :summoner
  belongs_to :match

  validates :summoner_id, presence: true
  validates :match_id, presence: true
  validates :riot_timestamp, presence: true
  validates :ward_type, presence: true
  validates :event_type, presence: true
  
  #Hopefully you can't somehow place two wards in the same timestamp instant :X
  validates :summoner_id, uniqueness: { scope: :riot_timestamp }

end
