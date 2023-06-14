#!/bin/bash

git switch main --force
git pull
yarn install
yarn build
aprender-republish # cf. aliases on server via command `alias`
