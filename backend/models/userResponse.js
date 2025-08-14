import mongoose from 'mongoose';


// --- User Response Model ---
const userResponseSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    quizID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz', // Reference to the Quiz model
        required: true
    },
    questionID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question', // Reference to the Question model
        required: true
    },
    chosenOption: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Option', // Reference to the Option model
        required: false
    },
    answerText: String,
    isCorrect: Boolean,
}, {
    timestamps: true
});

export const UserResponse = mongoose.model('UserResponse', userResponseSchema);
