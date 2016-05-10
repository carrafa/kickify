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
        puts row.css('.dtstart').text
        puts row.css('.bands').text
        puts row.css('.venue').text

      end

    end
  end
end

url = "http://www.ohmyrockness.com/shows"
puts "Downloading #{url}"

scraper = GetPage::WebScraper.new
puts scraper.get_rockness_page(url)
