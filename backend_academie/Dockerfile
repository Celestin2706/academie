FROM php:8.3-apache

RUN apt-get update && apt-get install -y --no-install-recommends \
        git unzip libzip-dev libpq-dev \
    && docker-php-ext-install pdo_pgsql zip \
    && a2enmod rewrite \
    && rm -rf /var/lib/apt/lists/*

ENV PORT=10000
ENV COMPOSER_ALLOW_SUPERUSER=1

COPY docker/apache.conf /etc/apache2/sites-available/000-default.conf
RUN sed -ri 's/Listen 80/Listen ${PORT}/' /etc/apache2/ports.conf

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html
COPY . .

RUN mkdir -p storage/framework/cache/data storage/framework/sessions storage/framework/views storage/logs bootstrap/cache \
    && composer install --no-dev --optimize-autoloader --no-interaction \
    && chown -R www-data:www-data storage bootstrap/cache

RUN sed -i 's/\r$//' docker/start.sh && chmod +x docker/start.sh

CMD ["docker/start.sh"]
