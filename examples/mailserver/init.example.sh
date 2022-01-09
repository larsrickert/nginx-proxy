#!/bin/bash

# Run this script after first start of the mailserver to create the first admin user
# docker-compose exec admin flask mailu --help
# TODO: CHANGE ME: "example.de" to your main email domain, and password to initial admin password
docker-compose exec admin flask mailu admin mail example.de "CHANGE_THIS_PASSWORD"
docker-compose exec admin flask mailu alias postmaster example.de mail@example.de
