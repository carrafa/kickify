require './lib/songkick.rb'
require './lib/spotify.rb'

class Playlist

  attr_accessor :search, :shows, :artists, :songs

  def initialize (search)
    @search = search
    @songkick = Songkick.new(search)
    @shows = @songkick.get_shows 
    @artists = @songkick.get_artists
    @songs = get_songs
  end

  def get_songs
    song_array = []
    artists.each do |artist|
      artist = artist.gsub(/[\u0080-\u00ff]/, "")
      song_array.push Spotify.new(artist).track_uris
    end
    return song_array.flatten
  end

end
