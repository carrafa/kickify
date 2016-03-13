require "cuba/test"
require "./app.rb"

scope do

  setup do
    @playlist = Playlist.new("new+york")
  end

  test "playlist should return array of artists" do |playlist|

    puts playlist.artists
    assert playlist.artists

  end

  test "playlist should return array of track uris" do |playlist|

    puts playlist.songs
    assert playlist.songs

  end

end

puts "done with playlist tests"
