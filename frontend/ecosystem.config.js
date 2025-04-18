module.exports = {
  apps: [{
    name: "mars-lab-frontend",
    cwd: "/www/wwwroot/marslab-blog/frontend",
    script: "npm",
    args: "run start",
    env: {
      NODE_ENV: "production",
      PORT: 3002,
      HOSTNAME: "0.0.0.0"
    },
    instances: 1,
    exec_mode: "cluster",
    autorestart: true,
    watch: false,
    max_memory_restart: "1G",
    pre_start: "npm run build"
  }]
}
