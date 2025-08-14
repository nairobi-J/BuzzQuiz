import mongoose from 'mongoose';


// --- Short Answer Model ---
const shortAnswerSchema = new mongoose.Schema({
    answerText: {
        type: String,
        required: true
    },
    questionID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question', // Reference to the Question model
        required: true
    },
}, {
    timestamps: true
});

export const ShortAnswer = mongoose.model('ShortAnswer', shortAnswerSchema);