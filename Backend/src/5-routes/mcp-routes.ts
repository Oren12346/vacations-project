// Express routes for mcp endpoints.
import express, { Request, Response } from "express";
import mcpService from "../3-services/mcp-service";
import verifyLoggedIn from "../4-middleware/verify-logged-in";

// Create an Express router for this feature area.
const router = express.Router();

router.post("/question", verifyLoggedIn, async (request: Request, response: Response) => {
    const question = String(request.body.question || "").trim();

    if (!question) {
        response.status(400).send("Question is required.");
        return;
    }

    const answer = await mcpService.askQuestion(question);
    response.json({ answer });
});

export default router;