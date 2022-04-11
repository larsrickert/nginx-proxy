#!/bin/bash

# This script will enable the ufw firewall and set default rules to only allow
# incoming SSH, HTTP and HTTPS connections. UFW has to be already installed.

sudo ufw default deny incoming
sudo ufw default allow outgoing

sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https

sudo ufw enable
sudo ufw status verbose
