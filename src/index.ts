import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
<<<<<<< HEAD
import { setupVite, serveStatic } from "./vite";
import { requestLogger, errorLogger, log } from "./lib/request-logger";
=======
import { setupAuth } from "./auth";
import { logger } from "./lib/logging";
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

<<<<<<< HEAD
// Use the comprehensive request logger
app.use(requestLogger());

(async () => {
  const server = await registerRoutes(app);

  // Use the error logger middleware
  app.use(errorLogger());

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen(port, "0.0.0.0", () => {
    log(`Server started on port ${port}`, 'info', 'server');
  });
=======
app.use((req, res, next) => {
    const start = Date.now();
    const path = req.path;
    let capturedJsonResponse: Record<string, any> | undefined = undefined;

    const originalResJson = res.json;
    res.json = function (bodyJson, ...args) {
        capturedJsonResponse = bodyJson;
        return originalResJson.apply(res, [bodyJson, ...args]);
    };

    res.on("finish", () => {
        const duration = Date.now() - start;
        if (path.startsWith("/api")) {
            let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
            if (capturedJsonResponse) {
                logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
            }

            if (logLine.length > 80) {
                logLine = logLine.slice(0, 79) + "…";
            }

            logger.info(logLine);
        }
    });

    next();
});

(async () => {
    setupAuth(app);
    const server = await registerRoutes(app);

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
        const status = err.status || err.statusCode || 500;
        const message = err.message || "Internal Server Error";

        res.status(status).json({ message });
        throw err;
    });

    // ALWAYS serve the app on port 5000
    // this serves both the API and the client.
    // It is the only port that is not firewalled.
    const port = 5000;
    server.listen(port, "0.0.0.0", () => {
        logger.info(`serving on port ${port}`);
    });
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758
})();
