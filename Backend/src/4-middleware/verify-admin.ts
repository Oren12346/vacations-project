// Middleware that allows access only to admin users.
import { NextFunction, Request, Response } from "express";
import type { AuthPayload } from "../2-utils/token-service";

// Handle the verify admin flow for this file.
function verifyAdmin(request: Request, response: Response, next: NextFunction): void {
    void request;
    const user = response.locals.user as AuthPayload | undefined;

    if (!user) {
        response.status(401).send("You are not logged in.");
        return;
    }

    if (user.role !== "admin") {
        response.status(403).send("You are not allowed to access this resource.");
        return;
    }

    next();
}

export default verifyAdmin;