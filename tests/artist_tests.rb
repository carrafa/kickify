require "cuba/test"
require "./app.rb"


scope do

  setup do
    @artist = Artist.new("lassijasdkjfbkfjlksdaj")
  end

  test "artist should return empty track array if it can't find artist" do |artist|

    assert_equal artist.track_uris, []

  end

end

scope do

  setup do
    @artist = Artist.new("beatles")
  end

  test "artist should return 3 track uris on valid artist search" do |artist|

    assert artist.track_uris.length == 3

  end

end

puts 'done with artist tests'
