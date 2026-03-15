class SlugConstraint
  def matches?(request)
    if request.params[:slug]
      request.params[:slug] = request.params[:slug].downcase
    end
    true
  end
end
