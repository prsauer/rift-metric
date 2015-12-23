require "rails_helper"

describe Summoner do
  describe '.create' do
    it 'persists a summoner with valid attributes' do
      user = Summoner.create(:name => 'xbanthur', :riot_id => 123123)

      expect(user).to be_persisted
    end

    it 'does not persist if attributes are not valid' do
      user = Summoner.create

      expect(user).not_to be_persisted
      expect(user.errors[:name]).to include("can't be blank")
      
    end

    it 'cannot add duplicates' do

      size_before = Summoner.all.size

      Summoner.create(:name => 'xbanthur', :riot_id => 123123)
      Summoner.create(:name => 'xbanthur', :riot_id => 123122)
      Summoner.create(:name => 'xbinthur', :riot_id => 123123)

      expect(Summoner.all.size - size_before).to be 1

    end
  end
end
