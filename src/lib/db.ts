import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable");
}

interface ConnectionCache {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
}

const cached: ConnectionCache = { conn: null, promise: null };

async function connectDB(): Promise<Mongoose> {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {
            dbName: "taskManager"
        } as mongoose.ConnectOptions).then((mongooseInstance) => mongooseInstance);
    }

    cached.conn = await cached.promise;
    return cached.conn;
}

export default connectDB;
