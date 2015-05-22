#!/bin/bash

set -e

export PATH="./node_modules/.bin/:$PATH"

if [[ -z "$1" ]]; then
    echo "Please give 'URL to couch as parameter"
    exit
fi

echo "Cleaning up"
rm -rf ./assets/*
git co -f assets
echo "Webpacking "
webpack --progress
echo "Uploading"
node migrate.js $1
couchapp push couchapp.js $1
