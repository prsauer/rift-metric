require 'lol'

class RunepageGrabber

  def initialize
    @client = Lol::Client.new ENV['RIOT_API_KEY'], {region: "na"}
  end

  def query_runepages(id)
    Rails.cache.fetch("#{id}/rune_page_id", expires_in: 1.hours) do
      @client.summoner.runes(id)[id.to_s]
    end
  end

  def query_summoner_by_name(name)
    Rails.cache.fetch("#{name}/summoner_by_name", expires_in: 1.hours) do
      @client.summoner.by_name(name)
    end
  end

  def query_rune_info(rune_id)
    Rails.cache.fetch("#{rune_id}/rune_info_by_id", expires_in: 96.hours) do
      @client.static.rune.get(rune_id)
    end
  end

  def get_rune_pages(summoner_name)
    tc = query_summoner_by_name(summoner_name)
    tc_rune_pages = query_runepages(tc[0].id)

    @runepages = Array.new

    tc_rune_pages.each do |page|
      @runepages << page.name
    end
    @runepages
  end

  def get_rune_hash(summoner_name)
    summoner_info = query_summoner_by_name(summoner_name)[0]
    puts "Summoner Info"
    p summoner_info
    summoner_rune_pages = query_runepages(summoner_info.id)
    puts "rune_pages"
    puts summoner_rune_pages
    puts "Outro"

    @rune_hash = Hash.new

    summoner_rune_pages.each do |page|
      p page.name
      #p page.slots
      page.slots.each do |slot|

        info = query_rune_info(slot.rune_id)

        if @rune_hash.has_key? info.name
          @rune_hash[info.name] += 1
        else
          @rune_hash[info.name] = 1
        end

      end
    end
    @rune_hash
  end

end
