module BumbleberryOverrideHelper
  MODERN_FEATURES = [:css3_boxsizing, :css_sel3, :flexbox, :css_grid, :svg].freeze

  def capable_of(capability)
    if MODERN_FEATURES.include?(capability)
      true
    else
      super
    end
  end
end
