import mongoose from 'mongoose';

export async function connectDB(uri) {
    if(!uri) {
        console.warn("[db] MONGODB_URI not set. Skipping DB connection.");
        return;
    }
    try {
        await mongoose.connect(uri, {dbName: "tasktrackr", autoIndex: true});
        console.log("[db] Connected to MongoDB");
    } catch (err) {
        console.error("[db] MongoDB connection error:", err.message);
        process.exit(1);
    } 
}