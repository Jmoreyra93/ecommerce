// PM2 ecosystem — process manager para Node.js en Hostinger
// Uso: pm2 start ecosystem.config.js --env production

export default {
    apps: [
        {
            name: "connecticus-ecommerce",
            script: "server.js",
            instances: 1,           // usar "max" para modo cluster si el plan lo permite
            exec_mode: "fork",      // cambiar a "cluster" si se usa instances: "max"
            watch: false,           // nunca watchear en producción
            env: {
                NODE_ENV: "development",
                PORT: 9000,
            },
            env_production: {
                NODE_ENV: "production",
                // Las demás variables (MONGODB_URI, MP_ACCESS_TOKEN, etc.)
                // se cargan desde el panel de Hostinger o desde el archivo .env del servidor
            },
            error_file: "logs/err.log",
            out_file: "logs/out.log",
            log_date_format: "YYYY-MM-DD HH:mm:ss",
            max_restarts: 10,
            restart_delay: 4000,
        },
    ],
}
