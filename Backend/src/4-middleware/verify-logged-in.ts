// Middleware that verifies the request contains a valid token.
import { NextFunction, Request, Response } from "express";
import tokenService from "../2-utils/token-service";

// Handle the verify logged in flow for this file.
function verifyLoggedIn(request: Request, response: Response, next: NextFunction): void {
    const user = tokenService.verifyToken(request.headers.authorization);

    if (!user) {
        response.status(401).send("You are not logged in.");
        return;
    }

    response.locals.user = user;
    next();
}

export default verifyLoggedIn;