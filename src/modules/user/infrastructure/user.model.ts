import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
});

const Model = mongoose.models.User;
const newModel = mongoose.model("User", userSchema);

export const userModel = Model || newModel;
