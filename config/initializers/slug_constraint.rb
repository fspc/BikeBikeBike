class SlugConstraint
  def matches?(request)
    request.params[:slug] = request.params[:slug].downcase if request.params[:slug]
    true
  end
end
