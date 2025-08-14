import mongoose from 'mongoose';



// --- Course Model ---
const courseSchema = new mongoose.Schema({
    courseName: {
        type: String,
        required: true
    },
   description: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

export const Course = mongoose.model('Course', courseSchema);