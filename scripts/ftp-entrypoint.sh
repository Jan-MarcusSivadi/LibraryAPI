#!/bin/sh
set -e

# Create directories if they don't exist
mkdir -p /home/vsftpd/myuser/data/books
chmod -R 777 /home/vsftpd/myuser

# Start the original FTP server
exec /usr/sbin/run-vsftpd