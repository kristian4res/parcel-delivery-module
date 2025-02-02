#!/bin/bash

echo "Creating MySQL user..."
cat <<EOF > /tmp/init.sql
CREATE DATABASE IF NOT EXISTS "$DATABASE_NAME";
CREATE USER IF NOT EXISTS "$DATABASE_USER"@'%';
GRANT ALL PRIVILEGES ON "$DATABASE_NAME".* TO "$DATABASE_USER"@'%';
FLUSH PRIVILEGES;
EOF

if [ $? -eq 0 ]; then
    echo "User $DATABASE_USER created successfully."
else
    echo "Failed to create user $DATABASE_USER."
    exit 1
fi

echo "Executing the script..."
mysql -u root -p$MYSQL_ROOT_PASSWORD < /tmp/init.sql

if [ $? -eq 0 ]; then
    echo "Script executed successfully."
else
    echo "Failed to execute script."
    exit 1
fi

echo "Database user creation complete."