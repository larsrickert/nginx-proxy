# Setup linux server and domain

If you don't meet the prerequisites described on the [Getting Started](/guide/getting-started) page, you will find recommendations and instructions on how to order and setup a linux server and domain below.

## Setup your own linux server

### Order a VPS

You need a linux server for running the nginx-proxy. For servers located in Germany we recommend a Virtual Private Server (VPS) by netcup but you can use any linux server. They offer linux servers with following features:

- Starting from 2,99€ per month for 2 Cores, 2GB RAM and 40GB SSD
- RAID10
- DDoS Protection
- Hourly billing

You can checkout the prices on [their website](https://www.netcup.de/vserver/vps.php).

::: info Install Ubuntu
Netcup's servers are shipped with Debian Linux by default. We recommend installing the latest Ubuntu distribution before installing the nginx-proxy. To change the operating system login into their [server control panel](https://www.servercontrolpanel.de/SCP) and click on `Medien` in the nav bar. There you can choose between multiple images.
:::

### Install Docker and docker-compose

You can install Docker and docker-compose with their official instructions:

- [Install Docker](https://docs.docker.com/engine/install/)
- [Install docker-compose](https://docs.docker.com/compose/install/)

If you have installed ubuntu on your server and want to speed up the installation you can use the following script which includes all official installation steps to install the latest versions:

#### **Step 1:** Create a `install-docker-ubuntu.sh` file

```bash
touch install-docker-ubuntu.sh
```

and add the following content:

```bash
#!/bin/bash

# This script will install the latest version of docker and docker-compose for ubuntu.

# Install Docker for ubuntu
# According to: https://docs.docker.com/engine/install/ubuntu/
sudo apt-get update

sudo apt-get install \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update

sudo apt-get install docker-ce docker-ce-cli containerd.io

# Get latest docker-compose version
VERSION=$(curl --silent https://api.github.com/repos/docker/compose/releases/latest | grep -Po '"tag_name": "\K.*\d')

# Install docker-compose
DESTINATION=/usr/local/bin/docker-compose
sudo curl -L https://github.com/docker/compose/releases/download/${VERSION}/docker-compose-$(uname -s)-$(uname -m) -o $DESTINATION
sudo chmod +x $DESTINATION
```

#### **Step 2:** Execute the install script

```bash
bash ./install-docker-ubuntu.sh
```

## Setup a domain

You need to register / order a domain to use with the nginx-proxy, e.g. `example.com`. You can order your desired domain from any provider but you can order it together with your VPS [from netcup](https://www.netcup.de/bestellen/domainangebote.php) for e.g. 5€ per year for a `.de` domain.

After you ordered your domain make sure to [setup your DNS records](/guide/getting-started.html#dns-records).
