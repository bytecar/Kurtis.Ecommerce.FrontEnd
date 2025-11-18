// src/environments/environment.development.ts
export const environment = {
    production: false,

    USERS_API_URL: "https://localhost:59290",
    INVENTORY_API_URL: "https://localhost:59288",
    CATALOG_API_URL: "https://localhost:59289",
    JWT_SECRET: "fPXxcJw8TW5sA+S4rl4tIPcKk+oXAqoRBo+1s2yjUS4=",

    APP_VERSION: "1.0.0-dev",
    LOG_LEVEL: "debug",

    ENABLE_MAINTENANCE_MODE: false,
    ENABLE_CONSOLE_LOGS: true,
    ENABLE_STRICT_API: false,

    FRONTEND_URL: "http://localhost:5000",

    COOKIE_SECURE: false,
    COOKIE_SAMESITE: "Lax"
};
