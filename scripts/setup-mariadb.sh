#!/bin/bash
set -e

echo "Running MariaDB setup script..."

mysql -u root -p"${MARIADB_ROOT_PASSWORD}" <<-EOSQL
  CREATE DATABASE IF NOT EXISTS ${DATABASE};
  CREATE USER IF NOT EXISTS '${DB_USER}'@'%' IDENTIFIED BY '${DB_PASS}';
  GRANT ALL PRIVILEGES ON ${DATABASE}.* TO '${DB_USER}'@'%';
  FLUSH PRIVILEGES;
EOSQL

echo "MariaDB user and database setup done."