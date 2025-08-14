import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
    quizTitle: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    duration: {
        type: Number, // in minutes
        required: true,
        min: 1
    },
    creatorID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    courseID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    numQuestions: {
        type: Number,
        required: true,
        min: 1,
        max: 100
    },
    passingScore: {
        type: Number,
        required: true,
        min: 1
    },
    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
    }]
}, {
    timestamps: true
});

// Add index for better performance on frequent queries
quizSchema.index({ courseID: 1 });
quizSchema.index({ teacherID: 1 });

export const Quiz = mongoose.model('Quiz', quizSchema);