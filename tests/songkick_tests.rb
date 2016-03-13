require "cuba/test"
require "./app.rb"

scope do

  setup do
    @shows = Songkick.new("new+york")
  end

  test "should return list of artists" do |shows|
    
    assert shows.get_artists

  end
end

puts "done with songkick tests"
