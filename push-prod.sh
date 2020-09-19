#!/bin/bash

if [ "$#" -lt 1 ]; then
  echo "Usage: ./push-prod.sh <message>"
elif [ ! -d "../prod-master/" ]; then
  echo "../prod-master/ is not a valid directory"
else
  git add ./api/
  git commit -m "$1"
  cp -r ./api ../prod-master/
  cd ../prod-master
  git add ./api
  git commit -m "$1"
  git push origin master
  ./update-prod.sh
fi
