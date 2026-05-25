"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restrictTo = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../config/prisma"));
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';
const protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            return res.status(401).json({ message: 'You are not logged in! Please log in to get access.' });
        }
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const currentUser = await prisma_1.default.user.findUnique({
            where: { id: decoded.id },
            include: { driverProfile: true }
        });
        if (!currentUser) {
            return res.status(401).json({ message: 'The user belonging to this token no longer exists.' });
        }
        req.user = currentUser;
        next();
    }
    catch (error) {
        res.status(401).json({ message: 'Invalid token or session expired' });
    }
};
exports.protect = protect;
const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: 'You do not have permission to perform this action'
            });
        }
        next();
    };
};
exports.restrictTo = restrictTo;
//# sourceMappingURL=authMiddleware.js.map