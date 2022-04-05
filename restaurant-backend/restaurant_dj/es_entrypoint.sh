#!/bin/sh

set -e

host="$1"
shift

until curl --silent --fail "$host":9200/_cluster/health -c '\q'; do
  >&2 echo "Elastic search is unavailable - sleeping"
  sleep 1
done

echo "Elastic search is up - executing command"
exec "$@"