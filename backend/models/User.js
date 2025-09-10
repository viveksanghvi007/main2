// models/User.js (ES6 module version)

import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        name: { 
            type: String, 
            required: [true, "Name is required"],
            trim: true,
            minlength: [2, "Name must be at least 2 characters long"],
            maxlength: [50, "Name cannot exceed 50 characters"],
            match: [/^[a-zA-Z][a-zA-Z\s]*$/, "Name must start with a letter and can only contain letters and spaces"]
        },
        email: { 
            type: String, 
            required: [true, "Email is required"], 
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"]
        },
        password: { 
            type: String, 
            required: [true, "Password is required"],
            minlength: [8, "Password must be at least 8 characters long"]
        },
        isEmailVerified: {
            type: Boolean,
            default: false
        },
        otp: {
            code: String,
            expiresAt: Date
        },
        loginAttempts: {
            type: Number,
            default: 0
        },
        lockUntil: Date
    },
    { timestamps: true }
);

// Index for better performance
UserSchema.index({ email: 1 });
UserSchema.index({ "otp.expiresAt": 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("User", UserSchema);
