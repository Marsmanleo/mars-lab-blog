module.exports = {
  apps: [{
    name: "mars-lab-frontend",
    cwd: "/www/wwwroot/mars_lab_app/frontend",
    script: "node_modules/.bin/next",
    args: "start",
    env: {
      NODE_ENV: "production",
      PORT: 3002,
      HOSTNAME: "0.0.0.0"
    },
    instances: 1,
    exec_mode: "fork",
    autorestart: true,
    watch: false,
    max_memory_restart: "1G"
  }]
}
