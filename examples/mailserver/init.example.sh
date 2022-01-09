#!/bin/bash

# docker-compose exec admin flask mailu --help
# TODO: CHANGE "example.de" to your main email domain
docker-compose exec admin flask mailu admin mail example.de "CHANGE_THIS_PASSWORD"
docker-compose exec admin flask mailu alias postmaster example.de mail@example.de
