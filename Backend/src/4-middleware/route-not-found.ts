// Fallback middleware for unknown backend routes.
import { NextFunction, Request, Response } from "express";

// Handle the route not found flow for this file.
function routeNotFound(request: Request, response: Response, next: NextFunction): void {
    void request;
    void next;
    response.status(404).send("Route not found.");
}

export default routeNotFound;