class SpotifyAPI < Cuba; end

SpotifyAPI.define do
  on 'profile' do
      url = 'https://api.spotify.com/v1/me'
      response = Unirest.get(url, headers: {"Authorization": "Bearer #{session[:access_token]}"})
      res.write response.body.to_json
  end

end


