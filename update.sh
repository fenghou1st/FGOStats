#!/usr/bin/env bash

COMPOSER=composer.local.json composer update -vv
bin/console cache:clear --env=prod

npm run build
rm -rf *.json.gzip
rm -rf var/cache/* var/logs/* var/sessions/*

tail -100 ~/php/logs/error_fgo_stats.log
tail -100 ~/php/logs/access_fgo_stats.log
