// Express routes for vacations endpoints.
import express, { NextFunction, Request, Response } from "express";
import vacationsService from "../3-services/vacations-service";
import VacationModel from "../1-models/vacation-model";
import verifyLoggedIn from "../4-middleware/verify-logged-in";
import upload from "../2-utils/upload";
import verifyAdmin from "../4-middleware/verify-admin";
import { AuthPayload } from "../2-utils/token-service";

// Create the vacations router.
const router = express.Router();

// Return all vacations for the logged-in user.
router.get("/", verifyLoggedIn, async (_request: Request, response: Response, next: NextFunction) => {
    try {
        const user = response.locals.user as AuthPayload;
        const vacations = await vacationsService.getAllVacations(user.userId);
        response.json(vacations);
    }
    catch (error) {
        next(error);
    }
});

router.get("/:vacationId", verifyLoggedIn, async (request: Request, response: Response, next: NextFunction) => {
    try {
        const vacationId = Number(request.params.vacationId);
        const vacation = await vacationsService.getOneVacation(vacationId);
        if (!vacation) {
            response.status(404).send("Vacation not found");
            return;
        }
        response.json(vacation);
    }
    catch (error) {
        next(error);
    }
});

// Update an existing vacation and optionally replace its image.
router.put("/:vacationId", verifyLoggedIn, verifyAdmin, upload.single("image"), async (request: Request, response: Response, next: NextFunction) => {
    try {
        const vacationId = Number(request.params.vacationId);
        const vacation = Object.assign(new VacationModel(), request.body); vacation.vacationId = vacationId;
        vacation.price = +vacation.price;

        const existingVacation = await vacationsService.getOneVacation(vacationId);
        if (!existingVacation) {
            response.status(404).send("Vacation not found");
            return;
        }

        if (request.file) {
            vacation.imageName = request.file.filename;
        }
        else {
            vacation.imageName = existingVacation.imageName;
        }

        const updatedVacation = await vacationsService.updateVacation(vacation);
        response.json(updatedVacation);
    }
    catch (error) {
        next(error);
    }
});

router.post("/", verifyLoggedIn, verifyAdmin, upload.single("image"), async (request: Request, response: Response, next: NextFunction) => {
    try {
        const vacation = Object.assign(new VacationModel(), request.body);

        if (request.file) {
            vacation.imageName = request.file.filename;
        }

        vacation.price = +vacation.price;

        const addedVacation = await vacationsService.addVacation(vacation);
        response.status(201).json(addedVacation);
    }
    catch (error) {
        next(error);
    }
}
);
router.delete("/:vacationId", verifyLoggedIn, verifyAdmin, async (request: Request, response: Response, next: NextFunction) => {
    try {
        const vacationId = Number(request.params.vacationId);
        const isDeleted = await vacationsService.deleteVacation(vacationId);
        if (!isDeleted) {
            response.sendStatus(404)
            return;
        }
        response.sendStatus(204);
    }
    catch (error) {
        next(error);
    }
});

export default router;