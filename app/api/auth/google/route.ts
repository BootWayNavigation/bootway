import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { generateToken } from '@/lib/auth-helpers';

const client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const { credential } = await req.json();

        if (!credential) {
            return NextResponse.json({ success: false, message: 'Missing Google credential' }, { status: 400 });
        }

        // Verify the token
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        
        if (!payload || !payload.email) {
            return NextResponse.json({ success: false, message: 'Invalid Google credential' }, { status: 401 });
        }

        const email = payload.email.toLowerCase();
        let user = await User.findOne({ email });

        if (!user) {
            // Create a new user if they don't exist
            // Generate a random secure password since the schema requires a password
            const randomPassword = crypto.randomBytes(32).toString('hex');
            
            user = new User({
                fullName: payload.name || email.split('@')[0],
                email: email,
                password: randomPassword,
                authProvider: 'google',
                googleId: payload.sub,
                role: 'candidate',
                avatar: payload.picture || null,
            });
        } else {
            // If user exists but it's their first time logging in with Google,
            // we update their googleId and authProvider if not set
            if (!user.googleId) {
                user.googleId = payload.sub;
                user.authProvider = 'google';
            }
        }

        user.lastLogin = new Date();
        await user.save();

        const token = generateToken(user._id.toString(), user.email, user.role);

        return NextResponse.json({
            success: true, 
            message: 'Logged in successfully with Google', 
            token,
            user: { _id: user._id, fullName: user.fullName, email: user.email, role: user.role, avatar: user.avatar }
        });
    } catch (err: any) {
        console.error('Google Login error:', err);
        return NextResponse.json({ success: false, message: 'Google Authentication failed' }, { status: 500 });
    }
}
