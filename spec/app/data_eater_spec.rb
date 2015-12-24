require "rails_helper"
require "vcr"


VCR.configure do |config|
  config.cassette_library_dir = "fixtures/vcr_cassettes"
  config.hook_into :webmock # or :fakeweb
end

describe 'DataEater' do
  describe 'DataEater static functions' do
    it 'can convert camel to unders' do
      expect(DataEater.camel_to_underscore("camelCaseFunction1")).to eq("camel_case_function_1")
    end
  end
  
  describe 'does' do

    it 'create models with associations' do
      VCR.use_cassette("match_2035584636") do
        eater = DataEater.new
        eater.eat_match(2035584636)
        eater.eat_match(2004011794)

        banthur = Summoner.find_by name: "xbanthur"

        #summoner has many performances
        expect(banthur.performances.all.count).to be 2
        #summoner has many matches
        expect(banthur.matches.all.count).to be 2

        one_match = Match.find_by riot_match_id: 2035584636

        #match has many performances
        expect(one_match.performances.count).to be 10
        #match has many summoners
        expect(one_match.summoners.count).to be 10
      end
    end

  end
end
