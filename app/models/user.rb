class User < ActiveRecord::Base
  authenticates_with_sorcery! do |config|
        config.authentications_class = Authentication
    end

  validates :email, uniqueness: true

  mount_uploader :avatar, AvatarUploader

  has_many :user_organization_relationships
  has_many :organizations, through: :user_organization_relationships
  has_many :conferences, through: :conference_administrators
  has_many :authentications, :dependent => :destroy
  accepts_nested_attributes_for :authentications

  before_update do |user|
    user.locale ||= I18n.locale
    user.email.downcase!
  end

  before_save do |user|
    user.locale ||= I18n.locale
    user.email.downcase!
  end

  def can_translate?(to_locale = nil, from_locale = nil)
    is_translator unless to_locale.present?

    from_locale = I18n.locale unless from_locale.present?
    return languages.present? &&
      to_locale.to_s != from_locale.to_s &&
      languages.include?(to_locale.to_s) &&
      languages.include?(from_locale.to_s)
  end

  def name
    firstname || username || email
  end

  def named_email
    name = firstname || username
    return email unless name
    return "#{name} <#{email}>"
  end

  def administrator?
    role == 'administrator'
  end

  def self.AVAILABLE_LANGUAGES
    [:en, :es, :fr, :ar]
  end

  def self.get(email)
    user = find_user(email)

    unless user
      user = create(email: email, locale: I18n.locale)
    end

    return user
  end

  def self.find_user(email)
    User.where('lower(email) = ?', email.downcase).first
  end

end
