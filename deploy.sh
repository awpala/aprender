#!/bin/bash

# Set environment variables and source files
source $HOME/.bash_profile
source $HOME/.bashrc

echo "User's Home directory: $HOME"
git switch master --force
git pull
nvm use 14 # client app requires Node v.14
yarn install
yarn build
aprender-republish # cf. aliases on server per command `alias`
