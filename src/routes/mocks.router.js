import { Router } from "express";
import generateMocks from '../controllers/mocks.controller.js'

const router = Router();

router.get("/mockingpets", generateMocks.petsMock);
router.get("/mockingusers", generateMocks.usersMock);
router.post("/generateData", generateMocks.generateData);

export default router;
