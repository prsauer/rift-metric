require "rails_helper"
require "vcr"


VCR.configure do |config|
  config.cassette_library_dir = "fixtures/vcr_cassettes"
  config.hook_into :webmock # or :fakeweb
end

describe 'Db Associations' do
  describe 'Summoners have matches' do

    it 'tests vcr' do
      VCR.use_cassette("summoner_xbanthur") do
        hg = HistoryGrabber.new
        id = hg.query_summoner_by_name("xbanthur")[0].id
      end
    end

    it 'is a test' do
      puts "then"
      Summoner.all.each { |d| puts "?#{d.name}?" }
      Summoner.all.each { |d| d.destroy }
      puts "now"
      Summoner.all.each { |d| puts "?#{d.name}?" }

      user = Summoner.create(:name => "xbanthur", :riot_id => 123123)

      Summoner.all.each { |d| d.destroy }


    end
  end
end
