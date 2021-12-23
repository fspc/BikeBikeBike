############
# BikeBike #
############


FROM ruby:2.5
MAINTAINER Jonathan Rosenbaum <bike@bikelover.org>

##RUN git clone https://github.com/fspc/BikeBikeBike.git /app/BikeBike
COPY . /app/BikeBike

RUN apt-get update && apt-get install -y  nodejs postgresql-client

# Note: phantomjs has been deprecated in favor of headless chrome
WORKDIR /app/BikeBike

# COPY changes/Gemfile .
# Use DATABASE_URL env variable instead, although it takes precedence, regardless
# COPY database.yml ./config/database.yml 
RUN bundle install

RUN mkdir -p public/stylesheets/application -p public/stylesheets/web-fonts  && tar xvfz bumbleberry-css.tar.gz -C public/stylesheets/application && tar xvfz bumbleberry-css.tar.gz -C public/stylesheets/web-fonts

#RUN gem install json -v '1.8.6'
#RUN gem install activesupport -v '4.2.0'
#RUN gem install mini_portile2 -v '2.6.1'
#RUN gem install racc -v '1.6.0'
#RUN gem install actionview -v '4.2.0'

# Gem::LoadError: You have already activated rake 12.3.3, but your Gemfile requires rake 11.1.2. Prepending `bundle exec` to your command may solve this.
# Do this with docker-compose
# RUN rake db:create
# RUN rake db:migrate


# Add a script to be executed every time the container starts.
COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]
EXPOSE 3000

# Configure the main process to run when running the image
CMD ["rails", "server", "-b", "0.0.0.0"]
