// Express routes for admin endpoints.
import express from "express";
import verifyLoggedIn from "../4-middleware/verify-logged-in";
import verifyAdmin from "../4-middleware/verify-admin";
import vacationsRoutes from "./vacations-routes";

// Create an Express router for this feature area.
const router = express.Router();

router.use("/vacations", verifyLoggedIn, verifyAdmin, vacationsRoutes);

export default router;