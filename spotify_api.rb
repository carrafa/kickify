class SpotifyAPI < Cuba; end

SpotifyAPI.define do

  on get do

    on 'profile' do
        url = 'https://api.spotify.com/v1/me'
        response = Unirest.get url, 
                               headers: {"Authorization": "Bearer #{session[:access_token]}"}
        res.write response.body.to_json
    end

    on 'playlists' do
      user_id = session[:user_id]
      url = "https://api.spotify.com/v1/users/#{user_id}/playlists"
      response = Unirest.get url, 
                             headers: {"Authorization": "Bearer #{session[:access_token]}"}
      res.write response.body.to_json
    end

  end

  on post do

    on 'playlist/create' do
      name = req[:name]
      user_id = session[:user_id]
      url = "https://api.spotify.com/v1/users/#{user_id}/playlists"
      response = Unirest.post url, headers: {"Authorization": "Bearer #{session[:access_token]}", "Content-Type": "application/json"},
        parameters: {name: name}.to_json

      puts response.headers
      puts response.body
      res.write response.body.to_json
    end

    on 'playlist/add_tracks' do
      user_id = session[:user_id]
      playlist_id = req[:playlist_id]
      uris = req[:tracks]
      url = "https://api.spotify.com/v1/users/#{user_id}/playlists/#{playlist_id}/tracks?uris=#{uris}"
      response = Unirest.post url, headers: {"Authorization": "Bearer #{session[:access_token]}", "Content-Type": "application/json"}
      res.write response.body
    end

  end

end
