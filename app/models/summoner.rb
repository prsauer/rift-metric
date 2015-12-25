class Summoner < ActiveRecord::Base
  has_many :performances
  has_many :kill_events
  has_many :matches, :through => :performances
  validates :riot_id, :name, presence: true
  validates :riot_id, :name, uniqueness: true
end
