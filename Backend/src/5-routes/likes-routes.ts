import express, { Request, Response } from "express";
import likesService from "../3-services/likes-service";
import verifyLoggedIn from "../4-middleware/verify-logged-in";
import { AuthPayload } from "../2-utils/token-service";

const router = express.Router();

router.post("/", verifyLoggedIn, async (request: Request, response: Response) => {
    const user = response.locals.user as AuthPayload;
    const vacationId = Number(request.body.vacationId);

    await likesService.addLike(user.userId, vacationId);
    response.sendStatus(201);
});

router.delete("/:vacationId", verifyLoggedIn, async (request: Request, response: Response) => {
    const user = response.locals.user as AuthPayload;
    const vacationId = Number(request.params.vacationId);

    await likesService.removeLike(user.userId, vacationId);
    response.sendStatus(204);
});

export default router;