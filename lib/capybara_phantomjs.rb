require 'capybara/poltergeist'

class Scraper

  def initialize
    Capybara.register_driver :poltergeist do |app|
      Capybara::Poltergeist::Driver.new(app, js_errors: false)
    end

    Capybara.default_driver = :poltergeist
  end

  def get_url

    browser = Capybara.current_session
    url = "http://www.ohmyrockness.com/shows"
    browser.visit url

   browser.all('div').each { |div| puts div.text }
  end

end

scrape = Scraper.new
