import mongoose from 'mongoose';

// --- User Model ---
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
   
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ['student', 'teacher'],
        required: true
    },
}, {
    timestamps: true
});

export const User = mongoose.model('User', userSchema);