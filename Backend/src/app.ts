// Application entry point for the backend server.
import "dotenv/config";
import express from "express";
import cors from "cors";
import appConfig from "./2-utils/app-config";
import authRoutes from "./5-routes/auth-routes";
import vacationsRoutes from "./5-routes/vacations-routes";
import likesRoutes from "./5-routes/likes-routes";
import adminRoutes from "./5-routes/admin-routes";
import reportsRoutes from "./5-routes/reports-routes";
import aiRoutes from "./5-routes/ai-routes";
import mcpRoutes from "./5-routes/mcp-routes";
import routeNotFound from "./4-middleware/route-not-found";
import catchAll from "./4-middleware/catch-all";
import path from "path";
import mcpHttp from "./7-mcp/mcp-http";


// Create the main Express application instance.
const server = express();

// Enable CORS and JSON body parsing for all API routes.
server.use(cors());
server.use(express.json());
server.use("/images", express.static(path.join(__dirname, "..", "assets", "images")));
server.use("/api/auth", authRoutes);
server.use("/api/vacations", vacationsRoutes);
server.use("/api/likes", likesRoutes);
server.use("/api/admin", adminRoutes);
server.use("/api/reports", reportsRoutes);
server.use("/api/ai", aiRoutes);
server.use("/api/mcp", mcpRoutes);
server.use("/mcp-server", mcpHttp);

// Register the fallback middlewares after all routes.
server.use(routeNotFound);
server.use(catchAll);

// Start the backend server on the configured port.
server.listen(appConfig.port, () => {
    console.log(`Listening on http://localhost:${appConfig.port}`);
});