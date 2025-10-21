import { verifyToken } from "../utils/auth.js";

export function requireAuth(req, res, next) {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) {
        return res.status(401).json({ error: "Missing token" });
    }

    try {
        const payload = verifyToken(token);
        req.user = { id: payload.sub, email: payload.email };
        next();
    }
    catch {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
}

