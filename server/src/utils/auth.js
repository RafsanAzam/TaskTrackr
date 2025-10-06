import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || "changeme";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

export async function verifyPassword(plain, hash) {
    return bcrypt.compare(plain, hash);
}

export function signToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token) {
    return jwt.verify(token, JWT_SECRET);
}