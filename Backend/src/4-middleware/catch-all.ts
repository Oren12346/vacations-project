// Global error middleware used as the last handler in the backend.
import { NextFunction, Request, Response } from "express";

// Handle the catch all flow for this file.
function catchAll(error: unknown, request: Request, response: Response, next: NextFunction): void {
    void request;
    void next;

    console.error(error);

    if (error instanceof Error && error.message === "Email already exists") {
        response.status(409).send(error.message);
        return;
    }

    if (error instanceof Error && error.message === "Invalid email or password") {
        response.status(401).send(error.message);
        return;
    }

    if (
        error instanceof Error &&
        (
            error.message === "All fields are required." ||
            error.message === "Email and password are required." ||
            error.message === "Invalid email." ||
            error.message === "Password must be at least 4 characters." ||
            error.message === "Missing required fields" ||
            error.message === "Price must be between 1 and 10000" ||
            error.message === "End date cannot be before start date" ||
            error.message === "Start date cannot be in the past" ||
            error.message === "Missing vacationId" ||
            error.message === "Invalid vacationId" ||
            error.message === "Invalid vacationId." ||
            error.message === "Invalid userId." ||
            error.message === "Invalid userId" ||
            error.message === "Invalid vacationId."
        )
    ) {
        response.status(400).send(error.message);
        return;
    }

    response.status(500).send("Internal server error.");
}

export default catchAll;