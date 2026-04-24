// Express routes for auth endpoints.
import express, { NextFunction, Request, Response } from "express";
import authService from "../3-services/auth-service";
import UserModel from "../1-models/user-model";
import CredentialsModel from "../1-models/credentials-model";

// Create an Express router for this feature area.
const router = express.Router();

router.post("/register", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const user = Object.assign(new UserModel(), request.body);
        const savedUser = await authService.register(user);
        response.status(201).json(savedUser);
    }
    catch (error) {
        next(error);
    }
});

router.post("/login", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const credentials = Object.assign(new CredentialsModel(), request.body);
        const result = await authService.login(credentials);
        response.json(result);
    }
    catch (error) {
        next(error);
    }
});


export default router;