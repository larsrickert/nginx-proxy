#!/bin/bash

# This script will pull latest changes from git (if git is available) and restart the docker-compose file for all applications.

for d in ./*/
do
  cd "$d"

  # try to git pull if git and remote exists
  git pull || echo "" > /dev/null

  docker-compose up -d
  cd ".."
done
