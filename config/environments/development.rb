BikeBike::Application.configure do

  config.app_config = config_for(:app_config)

  # Settings specified here will take precedence over those in config/application.rb.

  # In the development environment your application's code is reloaded on
  # every request. This slows down response time but is perfect for development
  # since you don't have to restart the web server when you make code changes.
  config.cache_classes = false

  # Do not eager load code on boot.
  config.eager_load = false

  # Show full error reports and disable caching.
  config.consider_all_requests_local       = true
  config.action_controller.perform_caching = false

  # Don't care if the mailer can't send.
  config.action_mailer.raise_delivery_errors = false

  # Print deprecation notices to the Rails logger.
  config.active_support.deprecation = :log

  # Raise an error on page load if there are pending migrations
  config.active_record.migration_error = :page_load

  # Debug mode disables concatenation and preprocessing of assets.
  # This option may cause significant delays in view rendering with a large
  # number of complex assets.
  config.assets.debug = true
  config.assets.digest = true 
  config.assets.compile = true

  config.assets.unknown_asset_fallback = false
  config.assets.precompile = ["manifest.js"]
  config.assets.check_precompiled_asset = false

  # Version of your assets, change this if you want to expire all your assets.
  config.assets.version = '1.01'

  config.serve_static_files = true

  # to deliver to the browser instead of email
  #config.action_mailer.delivery_method = :letter_opener
  #config.action_mailer.raise_delivery_errors = true
  #config.action_mailer.perform_deliveries = true

  # SMTP real-world test
  config.action_mailer.delivery_method = :smtp
  config.action_mailer.smtp_settings = {
    address: config.app_config['smtp_address'],
    domain: config.app_config['smtp_domain'],
    port: config.app_config['smtp_port'],
    ssl: config.app_config['smtp_ssl'],
    authentication: :plain,
    enable_starttls_auto: true,
    openssl_verify_mode: 'none',
    user_name: config.app_config['smtp_user_name'],
    password: config.app_config['smtp_password']
  }
  config.action_mailer.raise_delivery_errors = true
  config.action_mailer.perform_deliveries = true


  # Enable locale fallbacks for I18n (makes lookups for any locale fall back to
  # the I18n.default_locale when a translation can not be found).
  config.i18n.fallbacks = true  
  I18n.config.language_detection_method = I18n::Config::DETECT_LANGUAGE_FROM_SUBDOMAIN
  config.action_controller.default_url_options = { host: config.app_config['default_url'], trailing_slash: true }
  Sidekiq::Extensions.enable_delay!  

  #Paypal.sandbox!
  #config.action_controller.default_url_options = { trailing_slash: true }
end
