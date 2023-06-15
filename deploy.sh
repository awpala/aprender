#!/bin/bash

echo "User's Home directory: $HOME"
git switch master --force
git pull
source $HOME/.profile
source $HOME/.bashrc
nvm use 14 # client app requires Node v.14
yarn install
yarn build
aprender-republish # cf. aliases on server per command `alias`
