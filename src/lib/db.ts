import mongoose from 'mongoose';

// Pre-register all schemas to prevent Next.js tree-shaking errors during populate()
import '../models/User';
import '../models/Job';
import '../models/Application';
import '../models/Interview';
import '../models/Employee';
import '../models/Project';
import '../models/Task';

// Cache the connection to avoid reconnecting on every serverless invocation
let cached = (global as any).__mongoose;

if (!cached) {
    cached = (global as any).__mongoose = { conn: null, promise: null };
}

export async function connectDB() {
    if (!process.env.MONGO_URI) {
        throw new Error('Please define the MONGO_URI environment variable');
    }

    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(process.env.MONGO_URI, {
            bufferCommands: false,
            family: 4,
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        // Reset the cached promise so a fresh connection attempt can be made
        cached.promise = null;
        throw e;
    }
    return cached.conn;
}
