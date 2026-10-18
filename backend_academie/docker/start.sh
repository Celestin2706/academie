#!/bin/sh
set -e

php artisan migrate --force
php artisan db:seed --class=ProductionSeeder --force

exec apache2-foreground
