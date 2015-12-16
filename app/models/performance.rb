class Performance < ActiveRecord::Base
  belongs_to :summoner
  belongs_to :match

  validates :summoner_id, uniqueness: { scope: :match_id }
end
