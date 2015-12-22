create new heroku app
follow the instructions for using heroku's git and installing the heroku toolbelt

clone repo
git clone https://github.com/prsauer/rift-metric.git

Setup your heroku environment variables
--You will need a key to the Riot API!

RIOT_API_KEY = <your api key>
SITE_BASE_URL = <base url of your heroku app>


Install postgres for heroku
see (https://devcenter.heroku.com/articles/heroku-postgresql)

Run the initial migration
heroku run rake db:migrate

Start using the gathering api to collect data (assuming you have a rate limited Riot API key)
