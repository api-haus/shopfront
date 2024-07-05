#!/usr/bin/env bash

git pull
cd docker || exit 1

docker-compose build
docker-compose up -d sf-api_serve
