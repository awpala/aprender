#!/bin/bash

git switch master --force
git pull
nvm use 14 # client app requires Node v.14
yarn install
yarn build
aprender-republish # cf. aliases on server per command `alias`
