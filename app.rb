require 'cuba'
require 'cuba/render'
require 'cuba/sass'
require 'slim'
require 'json'
require 'dotenv'
Dotenv.load

require './lib/playlist.rb'

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

Cuba.define do

  on get do

    on root do
      res.write view("index")
    end

    on 'shows' do
      search = req[:search]
      playlist = Playlist.new(search)
      songs = playlist.songs
      res.write songs.to_json
    end

  end

end
