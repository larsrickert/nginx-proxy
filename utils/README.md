# Linux server / VPS setup utilities

Here you find useful linux commands and scripts that will speed up the setup of your linux server. It is recommended to use ubuntu as linux distribution. When using debian or another distribution you might need to adjust the commands and script.

The utilities include:

1. Creating non-root sudo user
2. ssh key management
3. firewall setup
4. Docker and docker-compose installation

<br />

# Prerequisites

1. Linux server running Ubuntu
2. Root shell access to the server

<br />

# Utility 1: Create non-root user with sudo permissions

1. Login as root
2. Create new user by running:

```
adduser username
```

3. Add the created user to sudo group

```
usermod -aG sudo username
```

<br />

# Utility 2: Copy ssh key from local machine to the server

Copying your ssh key to the linux server allows you to connect to the server from your machine without having to enter the user password every time.

1. Generate ssh key (if not already generated):

   If you dont already have a ssh key generated on you machine, run:

   ```
   ssh-keygen -t rsa -b 4096
   ```

2. Copy key to your linux server
   - change `{IP}` to the IP or domain of your server and `{username}` to your created user
   - on Windows:
   ```
   type $env:USERPROFILE\.ssh\id_rsa.pub | ssh {username}@{IP} "mkdir ~/.ssh && cat >> ~/.ssh/authorized_keys"
   ```
   - on Mac:
   ```
   ssh-copy-id -i ~/.ssh/id_rsa.pub {username}@{IP}
   ```

<br />

# Utility 3: Setup UFW Firewall

UFW is pre-installed on ubuntu. To setup and enable the firewall, run:

```
bash ./setup-ufw.sh
```

This will:

- Set default rules (block all incoming connections)
- Only allow incoming SSH, HTTP and HTTPS connections
- enable firewall

You can also inspect the script file and change it to your liking.

<br />

# Utility 4: Install docker and docker-compose

Run the install script with:

```
bash ./install-docker-ubuntu.sh
```

This will install the latest version of docker and docker-compose for ubuntu. The script implements the official installation guide, just combined in a single script to speed up installation.
