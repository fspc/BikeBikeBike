# Monkey-patch for bikecollectives_core gem to gracefully handle missing PayPal credentials
# This allows users to select "I can pay via host provided link" when PayPal isn't configured
if defined?(RegistrationControllerHelper)
  module PayPalFallback
    def paypal_configured?(conference)
      conference.paypal_email_address.present? &&
      conference.paypal_username.present? &&
      conference.paypal_password.present? &&
      conference.paypal_signature.present?
    end

    def payment_type_step(registration)
      conference = registration.conference
      payment_method = (registration.data || {})['payment_method']
      
      available_methods = ConferenceRegistration.all_payment_methods.dup
      available_methods.delete(:paypal) unless paypal_configured?(conference)
      
      if !paypal_configured?(conference) && payment_method == 'paypal'
        payment_method = 'host_payment'
      end
      
      {
        payment_method: payment_method,
        payment_methods: available_methods
      }
    end

    def payment_type_step_update(registration, params)
      return { status: :complete } if params[:button] == 'back'

      conference = registration.conference
      payment_type = params[:button].try(:to_sym)
      
      available_methods = ConferenceRegistration.all_payment_methods.dup
      available_methods.delete(:paypal) unless paypal_configured?(conference)
      
      unless available_methods.include?(payment_type)
        raise "Invalid payment type #{params[:button]}"
      end

      registration.data ||= {}
      registration.data['payment_method'] = payment_type.to_s
      registration.save!
      { status: :complete }
    end

    def payment_form_step(registration)
      payment_method = (registration.data || {})['payment_method'].present? ? registration.data['payment_method'].to_sym : nil

      if payment_method == :host_payment
        return {
          method: payment_method,
          amount: (registration.data || {})['payment_amount'],
          amounts: registration.conference.payment_amounts || Conference.default_payment_amounts,
          currencies: [registration.conference.default_currency],
          currency: registration.conference.default_currency,
          no_ajax: true,
          show_amount_form: true
        }
      end

      super
    end

    def payment_form_step_update(registration, params)
      payment_method = (registration.data || {})['payment_method'].to_sym

      if payment_method == :host_payment
        if params[:button] == 'back' || params[:button] == 'review'
          return { status: :complete }
        end

        value = (params[:value] || params[:custom_value] || 0).to_f
        unless value > 0
          return {
            status: :error,
            message: 'amount_required'
          }
        end

        registration.data ||= {}
        registration.data['payment_amount'] = value
        registration.data['payment_status'] = 'pending_manual'
        registration.save!
        return { status: :complete, message: 'manual_payment_pending' }
      end

      super
    end
  end
  RegistrationControllerHelper.prepend(PayPalFallback)
end
