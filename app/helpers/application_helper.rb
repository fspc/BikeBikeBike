require 'lingua_franca/form_helper'

module ApplicationHelper
  include PageHelper
  include RegistrationHelper
  include FormHelper
  include I18nHelper
  include WidgetsHelper
  include GeocoderHelper
  include TableHelper
  include AdminHelper

  RECAPTCHA_SITE_KEY = ENV['RECAPTCHA_SITE_KEY']

  def is_production?
    Rails.env == 'production' || Rails.env == 'preview'
  end

  def is_test?
    Rails.env == 'test'
  end

  def generate_confirmation(user, url, expiry = nil)
    ApplicationController::generate_confirmation(user, url, expiry)
  end
  
  def include_recaptcha_js
    raw %Q{
      <script src="https://www.google.com/recaptcha/api.js?render=#{RECAPTCHA_SITE_KEY}"></script>
    }
  end

  def recaptcha_execute(action)
    id = "recaptcha_token_#{SecureRandom.hex(10)}"

    raw %Q{
      <input name="recaptcha_token" type="hidden" id="#{id}"/>
      <script>
        if (typeof grecaptcha !== 'undefined') {
          grecaptcha.ready(function() {
            grecaptcha.execute('#{RECAPTCHA_SITE_KEY}', {action: '#{action}'}).then(function(token) {
              document.getElementById("#{id}").value = token;
            }).catch(function(error) {
              console.error('reCAPTCHA execution error:', error);
            });
          });
        } else {
          document.addEventListener('grecaptcha-ready', function() {
            grecaptcha.execute('#{RECAPTCHA_SITE_KEY}', {action: '#{action}'}).then(function(token) {
              document.getElementById("#{id}").value = token;
            }).catch(function(error) {
              console.error('reCAPTCHA execution error:', error);
            });
          });
        }
      </script>
    }
  end

end
