# Bike!Bike! #

| Environment | Build Status |
| ----------- |:------------:|
| Development | [![Development Build Status](https://travis-ci.org/bikebike/BikeBike.svg?branch=development)](https://travis-ci.org/bikebike/BikeBike) |
| Production  | It works with this Fork! |

## About this Fork

The Tech group for BikeBike!Everywhere! decided to utilize this conferencing/scheduling software for the next BikeBike.

This repository creates a test environment so that we can test/fix issues before manually committing them to the live site.

Instructions can be found in docker-compose.yml, and docker-compose.build.

### Install git-lfs

This repository utilizes git-lfs.  You will want git-lfs installed:

`apt-get install git-lfs`

then

`git lfs pull`

You can learn more about git-lfs commands at https://sabicalija.github.io/git-lfs-intro/ 

### About that letsencrypt network in docker-compose.yml

This network provides a nginx proxy and an automatic generation of letsencrypt certificates. 

#### The bike_bike_advanced_environment file

This file allows you to insert custom environmental variables, but primarily so that [ACME Companion](https://github.com/nginx-proxy/acme-companion) can be utilized to automate the creation, renewal and use of SSL certificates for proxied Docker containers through the ACME protocol.  This is useful to seamlessly handle the secure translation urls.  The example variables below communicate to an available external acme (letsencrypt) network to properly setup this proxied environment.

  ```
  VIRTUAL_HOST=bb.bikelover.org,en.bikelover.org,en.bb.bikelover.org,es.bb.bikelover.org,fr.bb.bikelover.org
  LETSENCRYPT_HOST=bb.bikelover.org,en.bikelover.org,en.bb.bikelover.org,es.bb.bikelover.org,fr.bb.bikelover.org
  LETSENCRYPT_EMAIL=bike@bikelover.org
  VIRTUAL_PORT=3000
  ```
This is an example docker-compose.yml file handling the letsencrypt network.  

<details>
<summary>

```
docker-compose.yml (acme-companion & nginx-proxy)
```

</summary>

```
version: '3'

# LetsEncrypt 
# If you need a custome nginx.conf, remember to copy it over

services:

  letsencrypt:
    image: nginxproxy/acme-companion
    container_name: letsencrypt
    #volumes_from:
    #  - nginx-proxy
    volumes:
      - certs:/etc/nginx/certs:rw
      - acme:/etc/acme.sh
      - vhost:/etc/nginx/vhost.d
      - html:/usr/share/nginx/html
      - /var/run/docker.sock:/var/run/docker.sock:ro
    environment:
      - NGINX_PROXY_CONTAINER=nginx-proxy
    #network_mode: "bridge"
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
    restart: always
    networks:
      letsencrypt:

  nginx-proxy:
    image: nginxproxy/nginx-proxy
    container_name: nginx-proxy
    volumes:
      - conf:/etc/nginx/conf.d
      - vhost:/etc/nginx/vhost.d
      - html:/usr/share/nginx/html
      - certs:/etc/nginx/certs:ro
      - /var/run/docker.sock:/tmp/docker.sock:ro
    ports:
      - "80:80"
      - "443:443"
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
    restart: always
    networks:
     letsencrypt:


volumes:
  certs:
  vhost:
  html:
  conf:
  acme:

networks:
  letsencrypt:
    external: true    
````

</details>

### Commonly used environmental variables in .env

```
RAILS_ENV={production | development | customized environment in config/environments}
PORT={usually 3000}
SMTP_ADDRESS={your SMTP server address}
SMTP_DOMAIN={The domain you want to link back in emails, usually the website itself, but not any translation subdomains}
SMTP_PORT={465 | ..}
SMTP_USER_NAME={SMTP username}
SMTP_PASSWORD={SMTP password}
SMTP_SSL={true | false}
ADMIN_EMAIL={administrator email address}
DEFAULT_URL={the website itself}
```

### After successful installation

There isn't much to do until the first conference is created. But you will need an adminstrator to make that happen.

First create a user for yourself at /user .  If you properly setup SMTP via docker, you will receive a confirmation email, which allows you to setup a session on your respective browser.

Then go to the database container (db), and utilizing psql, update your user.

  `UPDATE users SET role = 'administrator' WHERE firstname = 'Jonathan Rosenbaum';`

Now go to /conferences , create your first conference, and the fun begins!

The commandline psql interacts with the database with 'strict' sql statements, so use single quotes around strings, not double quotes, and all should be good.

Here's a good link to bring you up to speed with the power of psql:  [https://phili.pe/posts/postgresql-on-the-command-line/](https://phili.pe/posts/postgresql-on-the-command-line/)

### Job Scheduler for caniuse.js

[Caniuse.js](caniuse.js) uses browserslist to query the caniuse-lite database.  This is the substitute program for the now defunct Bumbleberry.  Ofelia is used as an independent scheduler, and ofelia labels in [services](docker-compose.yml)  establish the job requirements.

<details>

<summary>

```
docker-compose.yml for Ofelia job scheduler
```

</summary>

```
# This service provides ofelia, which is a job scheduler (cron).
# 
# There should be at least on job in one of the services to make this 
# meaningfull to run.
# 
# It is accessible everywhere since it is bound to the docker socket.
# Cron jobs can be conveniently created with labels.
#
# https://github.com/mcuadros/ofelia
#
# When you add/change a cron job simply -
# docker compose restart

services:
  ofelia:
    container_name: ofelia
    image: mcuadros/ofelia:latest
    command: daemon --docker
    restart: always
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

</details>


### Production and Development mode

You may easily switch between the production and development environment in the .env file.  

  `RAILS_ENV=production`

One good reason for doing this is that some system administration tasks are handled differently in production.  For instance, mail is delayed in production.

Realize you can always do things in the container .. the commands without docker-compose, or automate it all with a docker-compose script:

  `docker-compose exec bikebike /bin/bash`

#### From production to development after changing .env

   ```
   docker-compose down
   docker-compose up -d
   rake assets:clobber
   rake assets:precompile
   ```
#### From development to production after changing .env

   ```
   docker-compose down
   docker-compose up -d
   rake assets:clobber
   rake assets:precompile
   rake db:sessions:clear
   docker-compose restart bikebike
   ```

## From bikebike/bikebike

This is the repository for the Bike!Bike! website. It can be found in development at [preview.bikebike.org](https://preview-en.bikebike.org/) and in production at [bikebike.org](https://bikebike.org/)

Feel free to clone or fork the repository any time to start working on new features or fixes. To get help create an issue or contact Godwin: `goodgodwin` `@` `hotmail.com` any time.

![Screenshot of Bike!Bike!](https://workbench.bikecollectives.org/apps/bikebike/screenshots/application/home/3/desktop.png)

## Technologies ##

* [Ruby 2.3.0][1]
* [Rails 4.2.0][2] _([Project to upgrade to Rails 5](https://github.com/orgs/bikebike/projects/13))_
* [PostgreSQL][3]
* [HAML][4]
* [SCSS][5]
* [NGinx][6] _([We may switch to Caddy](https://github.com/bikebike/bikecollectives_core/issues/1))_
* [DigitalOcean][7] _([We may switch to Linode](https://github.com/bikebike/bikecollectives_core/issues/2))_

[1]: http://www.ruby-lang.org/en/
[2]: http://rubyonrails.org/
[3]: http://www.postgresql.org/
[4]: http://haml.info/
[5]: http://sass-lang.com/
[6]: https://www.nginx.com/
[7]: https://digitalocean.com


## Internal Gems ##
We will make a commitment to extract any functionality that makes sense to do so, into separate gems in order to share functionality with others, with our other projects (such as bikecollectives.org), and to enable easier collaboration amongst ourselves.

It is recommended that you at least use also clone `bikecollectives_core` into you workspace. To override the gem location execute:

```bash
bundle config local.bikecollectives_core PATH_TO/bikecollectives_core
```

Here is a list of the gems we have created so far, if you are a collaborator on this project you may need to become a collaborator on these gems as well. Don't hesitate to make a request, it won't be denied:

### Bike Collectives Core ###

[Bike Collectives Core](https://github.com/bikebike/bikecollectives_core) is where models, migrations, and some common controllers and helpers live. This Gem is shared between [Bike Collectives](https://github.com/bikebike/bikecollectives) and [Bike Collectives Workbench](https://github.com/bikebike/bikecollectives_workbench).

### Lingua Franca ###

[Lingua Franca](https://github.com/lingua-franca/lingua_franca) provides an easy way to include translatable content and provides a user interface for translators to provide translations. See [Translations](#translations) for best practices on the Bike!Bike! website.

### Bumbleberry ###
[Bumbleberry](https://github.com/bumbleberry/bumbleberry) provides cross-browser support with little effort and minimum file sizes. Basically it creates a different stylesheet for every known browser and only includes supported rules for each using information obtained from [caniuse.com](caniuse.com).


## Github Workflow ##
If you are a git wiz, feel free to adjust the steps below slightly, otherwise follow these steps until you are familiar enough to stray. What should remain constant is that we need to branch, code review, and merge with master.

1. Before you start working on a new feature, start working on a new branch (alternatively you can fork): `git checkout -b myname_new_feature`
1. Write your new feature
1. Add tests and execute them using `bundle exec i18n`
1. Make any adjustments, make sure you have included comments and abided other coding conventions
1. Check your git status to make sure you are on the correct branch and have any new files to add: `git status`
1. Add any new files using: `git add [myfile]`
1. Commit your changes: `git commit -am 'My commit message'`
1. Switch back to the development branch and pull the latest: `git checkout master && git pull`
1. Switch back to your branch: `git checkout myname_new_feature`
1. If there were any changes, rebase. This merges in the new code with your new code: `git rebase -i origin/development`
1. Push your changes: `git push origin myname_new_feature`
1. Make a pull request and wait for your code to be reviewed
1. If any changes are required, make them commit your changes, and rebase again. This time you need to make sure that you squash your commits (makes sure you only add one commit in the end). Where you see your commit message, change 'pick' to 'fixup' or 'f'.
1. Push your code again and repeat 12 and 13 until your code gets merged with development
1. Once your code is in development it will be released to our development site, once new translations are added and the site is manually tested it will be moved to master and the production site

## Deployment Process ##
Please note, we currently don't have this process set up, we're working to get here.

1. Write code and get it pulled into master
2. Your changes will be automatically be deployed to our preview site
3. Your changes will be tested there, if tests fail deployers will be notified
4. Once that deployment process completes and tests pass, translators will be notified if there are new translations
4. Once translators have completed translations, translations will be committed to master and your changes will be deployed to production


## Translations ##

Translating our site into multiple languages is a key part of opening it up to the world. When coding, never include any English text as in a string or Haml. Instead, we shall always use the underscore helper method `_`. The method takes a translation key and some optional parameters.

All translation is done in a collaborative, volunteer based system on the site itself, even the English text. If a user has sufficient permissions, the underscore method will produce highlighted text which can be edited directly by the user.

The method can be used as follows:

```haml
%h1=_'basename.my_title'
%p=_'basename.my_key', :paragraph
%button=_'basename.click_me'
```

Assuming none of the keys map to translations, this will be rendered into the following HTML:

```html
<h1>
  Lorem ipsum dolor sit amet
</h1>

<p>
  Curabitur non nulla sit amet nisl tempus convallis quis ac lectus. Vivamus magna justo, lacinia eget consectetur sed, convallis at tellus. Proin eget tortor risus. Donec sollicitudin molestie malesuada. Donec rutrum congue leo eget malesuada.
</p>

<button>
  click me
</button>
```

By default, the key will be translated using the last key part ('click me' in this example), however if a context is provided, some appropriate lorem ipsum text. Available contexts are:

* `title` (alias: `t`): title text, a few words in upper case
* `word` (alias: `words`, `w`): A word, if a second parameter is provided a numbr of words will be rendered (for example `_'key',:w,3`)
* `sentence` (alias: `sentences`, `s`): A sentence or multiple sentence
* `paragraph` (alias: `p`): A paragraph

If actual translations are not provided by the time the code hits production, fatals will occur.

### Entering translations

Translations can be provided directly by editing [`en.yml`](https://github.com/bikebike/BikeBike/blob/master/config/locales/en.yml) but will also be directly using the [workbench](https://github.com/bikebike/bikecollectives_workbench):

![Screenshot of the Bike Collectives Workbench](https://i.imgur.com/y8Ezjeg.png)

### Collecting translations

Translations, along with screenshots and HTML page captures are collected during testing so that the workbench will have up to date translations and context for each to make it easier for translators to provide relevant translations. To collect these translations yourself, execute `rake i18n`.

## Testing Practices ##

Our focus will be on integration testing using Capybara. While testing the app records all translations that it finds, whether or not they exist, and which pages that they were found on.

Before commiting you shuold always run:

```bash
bundle exec rake cucumber:run
```

and:

```bash
bundle exec rake i18n
```

The former is going to be faster but does not perform checks for untranslated content, it is recommneded that you run this regularily while developing while running the `i18n` check will ensure that you have not missed translations.

If you are creating any new content you will also want to add a new feature or scenario to ensure the new translations are picked up.
