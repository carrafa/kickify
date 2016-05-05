require 'unirest'

class Artist

  attr_reader :search
  attr_accessor :artist_search_url, :artist_info, :artist_id, :top_tracks_search_url, :top_tracks, :track_uris

  def initialize(search)
    @search = search
    @artist_search_url = "https://api.spotify.com/v1/search?q=#{search}&type=artist"
    @artist_info = artist_search
    @artist_id = get_artist_id
    @top_tracks_search_url = "https://api.spotify.com/v1/artists/#{artist_id}/top-tracks?country=US"
    @top_tracks = get_top_tracks
    @track_uris = get_track_uris
  end

  def artist_search
    response = Unirest.get artist_search_url 
    return response.body['artists']['items'][0]
  end

  def get_artist_id
    if artist_info
      return artist_info['id']
    end
  end
    
  def get_top_tracks
    if artist_id
      response = Unirest.get top_tracks_search_url
      return response.body['tracks']
    end
  end

  def get_track_uris
    uri_array = []
    if top_tracks
      top_tracks[0..2].each do |track|
        uri_array.push track['uri']
      end
    end
    return uri_array
  end

end
