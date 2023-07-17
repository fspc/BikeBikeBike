############
# BikeBike #
############


FROM ruby:2.5
MAINTAINER Jonathan Rosenbaum <bike@bikelover.org>

COPY . /app/BikeBike

RUN apt-get update && apt-get install -y  nodejs postgresql-client vim less 

RUN curl -fsSL https://get.pnpm.io/install.sh | bash - && /root/.local/share/pnpm/pnpm add browserslist

# Note: phantomjs has been deprecated in favor of headless chrome
WORKDIR /app/BikeBike

RUN mkdir -p public/stylesheets/application \ 
          -p public/stylesheets/web-fonts \ 
          -p public/stylesheets/admin \ 
          && tar xvfz bumbleberry-application.tar.gz -C public/stylesheets/application \
          && tar xvfz bumbleberry-web-fonts.tar.gz -C public/stylesheets/web-fonts \
          && tar xvfz bumbleberry-admin.tar.gz -C public/stylesheets/admin \
          && /app/BikeBike/caniuse.js

RUN bundle install

# Add a script to be executed every time the container starts.
COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]
EXPOSE 3000

# Configure the main process to run when running the image
CMD ["rails", "server", "-b", "0.0.0.0"]
