require "cuba/test"
require "./app.rb"

scope do

  setup do
    @songkick = Songkick.new("new+york")
  end

  test "should return list of artists" do |songkick|
    
    assert songkick.get_artists

  end

  test "should return city name" do |songkick|
    puts

    puts songkick.city
    assert songkick.city
  end

end

puts "done with songkick tests"
