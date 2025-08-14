import mongoose from 'mongoose';



// --- Enrollment Model ---
const enrollmentSchema = new mongoose.Schema({
    studentID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    courseID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course', // Reference to the Course model
        required: true
    },
}, {
    timestamps: true
});

export const Enrollment = mongoose.model('Enrollment', enrollmentSchema);