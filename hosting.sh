#!/bin/bash

# ref: https://devmountain.github.io/Host-Helper/

# append NGINX configuration to file `/etc/nginx/sites-available/aprender`,
# the configuration listens on port 80 and proxies requests to
# localhost:5555, and sets headers for proxying and upgrading the
# connection. Additionally, subdomain `db.aprender.tech` hosts 
# pgadmin access to live postgres database via Docker containers running on
# server as localhost (127.0.0.1).
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

  listen 443 ssl;

  # from porkbun
  ssl_certificate /etc/nginx/sites-available/ssl-certs-porkbun/aprender.tech/domain.cert.pem;
  ssl_certificate_key /etc/nginx/sites-available/ssl-certs-porkbun/aprender.tech/private.key.pem;
}

# pgadmin (HTTP) -- redirect to HTTPS
server {

  listen 80;

  server_name  db.aprender.tech;

  location / {
    return 301 https://$host$request_uri;
  }
}

# pgadmin (HTTPS)
server {

  listen 443 ssl;

  server_name  db.aprender.tech;

  # from porkbun
  ssl_certificate /etc/nginx/sites-available/ssl-certs-porkbun/aprender.tech/domain.cert.pem;
  ssl_certificate_key /etc/nginx/sites-available/ssl-certs-porkbun/aprender.tech/private.key.pem;

  location / {
    proxy_pass http://127.0.0.1:8080;
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

# BELOW IS OBSOLETE -- managing SSL cert via porkbun as of Sept 2023

# execute Certbot to obtain SSL/TLS cert for domain `aprender.tech` to
# provide HTTPS security for the domain
# sudo certbot  -d aprender.tech
