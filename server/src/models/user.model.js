import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true, minlength: 2, maxlength: 60 },
        email: { type: String, 
                 required: true, 
                 unique: true, 
                 lowercase: true,
                 trim: true, 
                 match: [/^\S+@\S+\.\S+$/, "Invalid email"] 
             },
        passwordHash: { type: String, required: true, select: false }
    },
    { timestamps: true}
);

export const User = mongoose.model("User", userSchema);