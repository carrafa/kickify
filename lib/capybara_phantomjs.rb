require 'capybara'
require 'capybara/dsl'
require 'capybara/poltergeist'

Capybara.default_driver = :poltergeist
Capybara.run_server = false

Capybara.register_driver :poltergeist do |app|
  Capybara::Poltergeist::Driver.new(app, phantomjs_options: ['--load-images=false', '--disk-cache=false'])
end

module GetPage
  class WebScraper
    include Capybara::DSL

    def get_rockness_page(url)
      visit(url)
      doc = Nokogiri::HTML(page.html)

      rows = doc.css('.vevent')

      rows.each do |row|
        date = row.css('.dtstart').text.gsub("\n", "").gsub(" ", "")
        bands = row.css('.bands').text.gsub("\n", "").gsub(" ", "").gsub(",", ", ")
        venue =  row.css('.venue').text.gsub("\n", "").gsub(" ", "")

        single_show = { date: date , bands: bands, venue: venue }

        puts single_show
      end

    end
  end
end

url = "http://www.ohmyrockness.com/shows"
puts "Downloading #{url}"

scraper = GetPage::WebScraper.new
puts scraper.get_rockness_page(url)
