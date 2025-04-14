#!/bin/bash
export PATH=/www/server/nodejs/v18.20.8/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/snap/bin
export PORT=3002
export HOSTNAME=0.0.0.0
cd /www/wwwroot/mars_lab_app/frontend
exec /www/server/nodejs/v18.20.8/bin/next start -p 3002 -H 0.0.0.0
