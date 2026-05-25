import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';
const JWT_EXPIRES_IN = '30d';

const generateToken = (id: string) => {
    return jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, name, role, phoneNumber } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ message: 'Please provide email, password and name' });
        }

        const userExists = await prisma.user.findUnique({ where: { email } });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await prisma.user.create({
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
            await prisma.driver.create({
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
    } catch (error: any) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
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
    } catch (error: any) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
