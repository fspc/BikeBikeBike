source 'http://rubygems.org'

gem 'rails', '4.2.0'
gem 'pg'

gem 'rack-mini-profiler'

gem 'haml'
gem 'nokogiri', '~> 1.6.8.rc2'

if Dir.exists?('../lingua_franca')
	gem 'lingua_franca', :path => '../lingua_franca'
else
	gem 'lingua_franca', :git => 'git://github.com/lingua-franca/lingua_franca.git'
end

gem 'tzinfo-data'
gem 'sass'
gem 'sass-rails'

if Dir.exists?('../bumbleberry')
	gem 'bumbleberry', :path => "../bumbleberry"
else
	gem 'bumbleberry', :git => 'git://github.com/bumbleberry/bumbleberry.git'
end

gem 'uglifier', '>= 1.3.0'
gem 'sorcery', '>= 0.8.1'
gem 'oauth2', '~> 0.8.0'
gem 'carrierwave'
gem 'carrierwave-imageoptimizer'
gem 'mini_magick'
gem 'geocoder'
gem 'paper_trail', '~> 3.0.5'
gem 'sitemap_generator'
gem 'activerecord-session_store'
gem 'paypal-express', '0.7.1'
gem 'sass-json-vars'
gem 'premailer-rails'
gem 'delayed_job_active_record'
gem 'redcarpet'

gem 'copydb'

group :test do
	gem 'rspec'
	gem 'rspec-rails'
end

group :development do
 	gem 'better_errors'
 	gem 'binding_of_caller'
 	gem 'meta_request'
	
	gem 'capistrano', '~> 3.1'
	gem 'capistrano-rails', '~> 1.1'
	gem 'capistrano-faster-assets', '~> 1.0'

	gem 'eventmachine', :github => 'krzcho/eventmachine', :branch => 'master'
	gem 'thin', :github => 'krzcho/thin', :branch => 'master'
end

group :test do
	gem 'gherkin3', '>= 3.1.0'
	gem 'cucumber'
	gem 'cucumber-core'
	gem 'cucumber-rails'

	gem 'poltergeist'
	gem 'guard-rspec'
	gem 'factory_girl_rails'
	gem 'coveralls', require: false
	gem 'launchy'
	gem 'selenium-webdriver'
	gem 'simplecov', require: false
	gem 'webmock', require: false
	gem 'database_cleaner'
	gem 'mocha'
end

group :staging, :production, :preview do
	gem 'rails_12factor'
end

group :production, :preview do
	gem 'unicorn'
	gem 'daemon-spawn'
	gem 'daemons'
end

platforms 'mswin', 'mingw' do
	group :test do
		gem 'wdm', '>= 0.1.0'
	end
end
