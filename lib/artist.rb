require 'unirest'

class Artist

  attr_reader :search, :show_id
  attr_accessor :artist_search_url, :artist_info, :artist_id, :top_tracks_search_url, :top_tracks, :top_tracks_uris, :top_tracks_details

  def initialize(search, show_id)
    @search = search
    @show_id = show_id
    @artist_search_url = "https://api.spotify.com/v1/search?q=#{search}&type=artist"
    @artist_info = artist_search
    @artist_id = get_artist_id
    @top_tracks_search_url = "https://api.spotify.com/v1/artists/#{artist_id}/top-tracks?country=US"
    @top_tracks = get_top_tracks
    @top_tracks_uris = get_all_track_uris
    @top_tracks_details = get_tracks_details
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

  def get_tracks_details
    tracks = []
    if top_tracks
      top_tracks[0..2].each do |track|
        tracks.push({:artist => track['artists'][0]['name'], :show_id => show_id, :uri => track['uri']})
      end
    end
    return tracks
  end


  def get_all_track_uris
    uris_array = []
    if top_tracks
      top_tracks[0..2].each do |track|
        uris_array.push track[:uri]
      end
    end
    return uris_array
  end

end
