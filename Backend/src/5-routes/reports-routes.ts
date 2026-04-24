// Express routes for reports endpoints.
import express, { NextFunction, Request, Response } from "express";
import reportsService from "../3-services/reports-service";
import verifyLoggedIn from "../4-middleware/verify-logged-in";
import verifyAdmin from "../4-middleware/verify-admin";

// Create an Express router for this feature area.
const router = express.Router();

router.get("/vacations-likes", verifyLoggedIn, verifyAdmin, async (request: Request, response: Response, next: NextFunction) => {
    try {
        void request;
        const report = await reportsService.getVacationsLikesReport();
        response.json(report);
    }
    catch (error) {
        next(error);
    }
});

router.get("/vacations-likes/csv", verifyLoggedIn, verifyAdmin, async (request: Request, response: Response, next: NextFunction) => {
    try {
        void request;
        const rows = await reportsService.getVacationsLikesReport();
        const csvLines = ["destination,likesCount", ...rows.map(row => `${row.destination},${row.likesCount}`)];
        response.setHeader("Content-Type", "text/csv");
        response.setHeader("Content-Disposition", "attachment; filename=vacations-likes.csv");
        response.send(csvLines.join("\n"));
    }
    catch (error) {
        next(error);
    }
});

export default router;