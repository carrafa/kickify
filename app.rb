require 'cuba'
require 'cuba/safe'
require 'cuba/render'
require 'cuba/sass'
require 'slim'
require 'json'
require 'dotenv'
require 'unirest'
Dotenv.load

require './lib/playlist.rb'
require './lib/spotify_api.rb'

Cuba.plugin Cuba::Render
Cuba.plugin Cuba::Sass

Cuba.use(
  Rack::Static,
  urls: %w(/js /stylesheets),
  root: "./public"
)

Cuba.settings[:render][:template_engine] = "slim"
Cuba.settings[:sass] = {
  style: :compact,
  template_location: "assets/stylesheets"
}

Cuba.use Rack::Session::Cookie, :secret => "__a_ver_long_string__"
Cuba.define do

  on get do

    on root do
      res.write view("welcome")
    end

    on 'spotify' do
      run SpotifyAPI
    end

    on 'shows' do
      search = req[:search]
      playlist = Playlist.new(search)
      songs = playlist.songs
      res.write songs.to_json
    end

    on 'auth/spotify' do
      client_id = ENV['spotify_client_id']
      scopes = 'playlist-modify-public'
      redirect = 'http:%2F%2Flocalhost:9292%2Fcallback'
      url = "https://accounts.spotify.com/authorize?client_id=#{client_id}&scope=#{scopes}&redirect_uri=#{redirect}&response_type=code"
      res.redirect url
    end

  
    on 'callback' do
      code = req[:code]
      url = "https://accounts.spotify.com/api/token"
      response = Unirest.post url, parameters: { :grant_type => "authorization_code", :code => code, "redirect_uri" => "http://localhost:9292/callback", "client_id" => ENV['spotify_client_id'], "client_secret" => ENV['spotify_client_secret']}
      session[:access_token] = response.body['access_token']
      res.write view("index")
    end

  end

end
