// src/environments/environment.development.ts

/*USERS_API_URL: "https://SUNNYGAME:59290",
INVENTORY_API_URL: "https://SUNNYGAME:59288",
CATALOG_API_URL: "https://SUNNYGAME:59289",
*/

export const environment = {
    production: false,

    USERS_API_URL: "http://SUNNYGAME:59292",
    INVENTORY_API_URL: "http://SUNNYGAME:59293",
    CATALOG_API_URL: "http://SUNNYGAME:59291",
    JWT_SECRET: "fPXxcJw8TW5sA+S4rl4tIPcKk+oXAqoRBo+1s2yjUS4=",

    APP_VERSION: "1.0.0-dev",
    LOG_LEVEL: "debug",

    ENABLE_MAINTENANCE_MODE: false,
    ENABLE_CONSOLE_LOGS: true,
    ENABLE_STRICT_API: false,

    FRONTEND_URL: "http://SUNNYGAME:5000",

    COOKIE_SECURE: false,
    COOKIE_SAMESITE: "Lax",
    HTTP_ONLY_COOKIES: true,
    HTTP_ONLY_JWT_COOKIES: true,
    HTTP_ONLY_REFRESH_TOKEN_COOKIES: true,
    HTTP_ONLY: true,
    NODE_TLS_REJECT_UNAUTHORIZED: "0",
    //NODE_EXTRA_CA_CERTS: "D:\\certs\\cert_public.pem"
};
