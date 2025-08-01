import mongoose from "mongoose";

if (!process.env.MONGODB_URL)
	throw new Error("MONGODB_URL is not defined.");

export async function connectToDatabase(): Promise<
	typeof mongoose
> {
	if (mongoose.connection.readyState >= 1) return mongoose;
	return mongoose.connect(process.env.MONGODB_URL!);
}
