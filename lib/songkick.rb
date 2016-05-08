require 'unirest'

class Songkick

  API_KEY = ENV['songkick_api_key']

  attr_reader :search
  attr_accessor :location_url, :metro_shows_url, :location_id, :location_results, :shows_results, :city


  def initialize(search)

    @search = search
    
    @location_url = "https://api.songkick.com/api/3.0/search/locations.json?query=#{search}&apikey=#{API_KEY}"
    @location_results = get_location_results
    @location_id = get_location_id
    @city = get_city
    @metro_shows_url = "https://api.songkick.com/api/3.0/metro_areas/#{location_id}/calendar.json?apikey=#{API_KEY}"
    @shows_results = get_shows_results

  end

  def get_city
    location_results['resultsPage']['results']['location'][0]
  end

  def get_location_id
    location_results['resultsPage']['results']['location'][0]['metroArea']['id']
  end

  def get_location_results
    response = Unirest.get location_url 
    return response.body
  end

  def get_shows_results
    response = Unirest.get metro_shows_url
    return response.body
  end

  def get_shows
    shows_results['resultsPage']['results']['event']
  end
  
  def get_artists
    artists = []
    
    shows_results['resultsPage']['results']['event'].each do |show|
      show['performance'].each do |performance|
        artist = { :show_id => performance['id'], :name => performance['artist']['displayName'] }
        artists.push artist
      end
    end

    return artists
  end


end
