#!/bin/sh
set -e

# Use FTP_USER env var or default to 'myuser'
USER_HOME="/home/vsftpd/${FTP_USER:-myuser}"

cat > /etc/nginx/nginx.conf <<EOF
events {}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    server {
        listen 80;
        root $USER_HOME;
        autoindex on;
    }
}
EOF

nginx -g 'daemon off;'