import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface JwtPayload {
    id: string;
    email: string;
    role: string;
}

export function generateToken(id: string, email: string, role: string): string {
    return jwt.sign({ id, email, role }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(req: NextRequest): JwtPayload | null {
    try {
        const authHeader = req.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        return decoded;
    } catch {
        return null;
    }
}

export function requireAuth(req: NextRequest): JwtPayload {
    const user = verifyToken(req);
    if (!user) {
        throw { status: 401, message: 'Not authorized to access this route' };
    }
    return user;
}

export function requireAdminHR(req: NextRequest): JwtPayload {
    const user = requireAuth(req);
    if (user.role !== 'admin' && user.role !== 'hr') {
        throw { status: 403, message: 'User role is not authorized to access this route' };
    }
    return user;
}

export function handleAuthError(err: any): NextResponse {
    if (err?.status) {
        return NextResponse.json({ success: false, message: err.message }, { status: err.status });
    }
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
}
