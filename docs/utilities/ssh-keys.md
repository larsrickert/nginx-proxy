# Using SSH keys

You will most likely have a SSH client installed on your local machine to connect to your linux server.
To simplify the connection with your server you can use a SSH key so you don't have to enter your password every time you want to connect to your server.

If you don't already have a SSH key you can generate one on your local machine with:

```bash
ssh-keygen -t rsa -b 4096
```

## Copy the SSH key to your server

To copy your SSH key to your server, use the following command and replace `{username}` and `{IP}` with the username and IP address of your linux server:

- on Windows:

  ```bash
  type $env:USERPROFILE\.ssh\id_rsa.pub | ssh {username}@{IP} "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
  ```

- on Mac:

  ```bash
  ssh-copy-id -i ~/.ssh/id_rsa.pub {username}@{IP}
  ```
