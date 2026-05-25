"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../config/prisma"));
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';
const JWT_EXPIRES_IN = '30d';
const generateToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};
const register = async (req, res) => {
    try {
        const { email, password, name, role, phoneNumber } = req.body;
        if (!email || !password || !name) {
            return res.status(400).json({ message: 'Please provide email, password and name' });
        }
        const userExists = await prisma_1.default.user.findUnique({ where: { email } });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 12);
        const user = await prisma_1.default.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: role || 'RIDER',
                phoneNumber
            }
        });
        // If it's a driver, we could create an empty profile here or separately
        if (user.role === 'DRIVER') {
            await prisma_1.default.driver.create({
                data: {
                    userId: user.id,
                    vehicleModel: req.body.vehicleModel || 'Unknown',
                    vehiclePlate: req.body.vehiclePlate || `TEMP-${Date.now()}`
                }
            });
        }
        const token = generateToken(user.id);
        res.status(201).json({
            status: 'success',
            token,
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            }
        });
    }
    catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }
        const user = await prisma_1.default.user.findUnique({ where: { email } });
        if (!user || !(await bcryptjs_1.default.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const token = generateToken(user.id);
        res.status(200).json({
            status: 'success',
            token,
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            }
        });
    }
    catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
exports.login = login;
//# sourceMappingURL=authController.js.map