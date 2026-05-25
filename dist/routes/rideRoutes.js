"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rideController_1 = require("../controllers/rideController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.protect);
router.post('/request', (0, authMiddleware_1.restrictTo)('RIDER'), rideController_1.requestRide);
router.patch('/:rideId/accept', (0, authMiddleware_1.restrictTo)('DRIVER'), rideController_1.acceptRide);
router.post('/location', (0, authMiddleware_1.restrictTo)('DRIVER'), rideController_1.updateLocation);
router.patch('/:rideId/complete', (0, authMiddleware_1.restrictTo)('DRIVER'), rideController_1.completeRide);
exports.default = router;
//# sourceMappingURL=rideRoutes.js.map