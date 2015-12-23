Rift-Metric is an analytics engine for League of Legends.

Currently it is capable of digesting data from the Riot API and presenting it in the form of plots of the data over the League minimap. Development is currently underway on features to provide insight and feedback to players to improve their play using historical data of their own matches and those of their peers.


HOW TO DEPLOY

Create new heroku app
follow the instructions for using heroku's git and installing the heroku toolbelt

Clone repo
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
