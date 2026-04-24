// Helpers for creating and validating JWT tokens.
import jwt from "jsonwebtoken";
import type RoleModel from "../1-models/role-model";
import appConfig from "./app-config";

export type AuthPayload = {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    role: RoleModel;
    iat?: number;
    exp?: number;
};

// Handle the get token from header flow for this file.
function getTokenFromHeader(authorizationHeader?: string): string | null {
    if (!authorizationHeader) {
        return null;
    }

    const [scheme, token] = authorizationHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
        return null;
    }

    return token;
}

// Handle the verify token flow for this file.
function verifyToken(authorizationHeader?: string): AuthPayload | null {
    const token = getTokenFromHeader(authorizationHeader);

    if (!token) {
        return null;
    }

    try {
        const decoded = jwt.verify(token, appConfig.jwtSecret);

        if (
            typeof decoded !== "object" ||
            !("userId" in decoded) ||
            !("role" in decoded)
        ) {
            return null;
        }

        return decoded as AuthPayload;
    }
    catch {
        return null;
    }
}

export default {
    verifyToken
};