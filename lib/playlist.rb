require './lib/songkick.rb'
require './lib/artist.rb'

class Playlist

  attr_accessor :search, :shows, :artists, :songs, :all_uris

  def initialize (search)
    @search = search
    @songkick = Songkick.new(search)
    @shows = @songkick.get_shows 
    @artists = @songkick.get_artists
    @songs = get_songs
    #@all_uris = get_all_songs_uris
  end

  def all_uris
    songs_array = []
    artists.each_with_index do |artist, i|
      artist_name = artist[:name].gsub(/[\u0080-\u00ff]/, "")
      show_id = artist[:show_id]
      puts " #{i}/#{artists.length} #{artist_name}"
      artist = Artist.new(artist_name, show_id)
      songs_array.push artist.top_tracks_uris
    end
    return songs_array.flatten
  end

  def get_songs
    songs_array = []
    artists.each_with_index do |artist, i|
      artist_name = artist[:name].gsub(/[\u0080-\u00ff]/, "")
      show_id = artist[:show_id]
      puts "#{i/artists.length}% #{artist_name}"
      artist = Artist.new(artist_name, show_id)
      songs_array.push artist.top_tracks_details
    end
    return songs_array.flatten
  end

end
