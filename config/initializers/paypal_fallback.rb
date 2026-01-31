# Monkey-patch for bikecollectives_core gem to gracefully handle missing PayPal credentials
# This allows the payment flow to work without PayPal configured
if defined?(RegistrationControllerHelper)
  module PayPalFallback
    def paypal_configured?(conference)
      conference.paypal_email_address.present? &&
      valid_paypal_credential?(conference.paypal_username) &&
      valid_paypal_credential?(conference.paypal_password) &&
      valid_paypal_credential?(conference.paypal_signature)
    end
    def valid_paypal_credential?(value)
      value.present? && value.strip.present?
    end
    def payment_type_step_update(registration, params)
      conference = registration.conference
      payment_type = params[:value].try(:to_sym)
      if !paypal_configured?(conference) && payment_type == :paypal
        registration.data ||= {}
        registration.data['payment_method'] = 'paypal'
        registration.save!
        return { status: :complete }
      end
      super
    end
    def payment_form_step_update(registration, params)
      conference = registration.conference
      username = conference.paypal_username
      password = conference.paypal_password
      signature = conference.paypal_signature
      unless valid_paypal_credential?(username) && valid_paypal_credential?(password) && valid_paypal_credential?(signature)
        Rails.logger.warn "[PayPalFallback] Missing or invalid PayPal credentials for conference #{conference.id}. Username: #{username.present?}, Password: #{password.present?}, Signature: #{signature.present?}"
        value = (params[:value] || params[:custom_value] || 0).to_f
        currency = conference.default_currency
        registration.data ||= {}
        registration.data['payment_amount'] = value
        registration.payment_info = {
          amount: value,
          currency: currency
        }.to_yaml
        registration.save!
        return { status: :complete }
      end
      super
    end
  end
  RegistrationControllerHelper.prepend(PayPalFallback)
end
