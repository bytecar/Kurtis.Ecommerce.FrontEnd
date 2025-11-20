import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic } from "./vite";
import { requestLogger, errorLogger, log } from "./lib/request-logger";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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
})();
