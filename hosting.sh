#!/bin/bash

# ref: https://devmountain.github.io/Host-Helper/

# append NGINX configuration to file `/etc/nginx/sites-available/aprender`,
# the configuration listens on port 80 and proxies requests to
# localhost:5555, and sets headers for proxying and upgrading the
# connection
sudo echo '
server {

  listen 80;

  server_name  aprender.tech;

  location / {
      proxy_pass http://127.0.0.1:5555;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection 'upgrade';
      proxy_set_header Host $host;
      proxy_cache_bypass $http_upgrade;
  }
}
' > /etc/nginx/sites-available/aprender;

# create symlink from `sites-available` to `sites-enabled`, thereby
# enabling configuration for domain `aprender.tech`
sudo ln -s /etc/nginx/sites-available/aprender /etc/nginx/sites-enabled;

# restart NGINX service to apply configuration changes
sudo service nginx restart

# execute Certbot to obtain SSL/TLS cert for domain `aprender.tech` to
# provide HTTPS security for the domain
sudo certbot  -d aprender.tech
