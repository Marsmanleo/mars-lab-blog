PATH=/www/server/nodejs/v18.20.8/bin:/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin
export PATH

export NODE_PROJECT_NAME="mars-lab-frontend"
export HOME=/root
/www/server/nodejs/v18.20.8/bin/pm2 start /www/server/nodejs/vhost/pm2_configs/mars-lab-frontend/ecosystem.config.cjs