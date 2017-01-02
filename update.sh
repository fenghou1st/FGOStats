#!/usr/bin/env bash

COMPOSER=composer.local.json composer update -vv
bin/console cache:clear --env=prod

tail -100 ~/php/logs/error_fgo_stats.log
tail -100 ~/php/logs/access_fgo_stats.log
