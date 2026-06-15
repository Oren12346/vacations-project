// Express routes for ai endpoints.
import express, { Request, Response } from "express";
import aiService from "../3-services/ai-service";
import verifyLoggedIn from "../4-middleware/verify-logged-in";

// Create an Express router for this feature area.
const router = express.Router();

router.post("/recommendation", verifyLoggedIn, async (request: Request, response: Response) => {
    const question = String(request.body.question || "").trim();

    if (!question) {
        response.status(400).send("Destination is required.");
        return;
    }

    const answer = await aiService.getRecommendation(question);
    response.json({ answer });
});

export default router;