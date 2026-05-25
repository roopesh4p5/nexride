"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paymentController_1 = require("../controllers/paymentController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.protect);
router.get('/history', paymentController_1.getRideHistory);
router.post('/pay', paymentController_1.processPayment);
exports.default = router;
//# sourceMappingURL=paymentRoutes.js.map