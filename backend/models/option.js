import mongoose from 'mongoose';


// --- Option Model ---
const optionSchema = new mongoose.Schema({
    optionText: {
        type: String,
        required: true
    },
    isCorrect: {
        type: Boolean,
        default: false
    },
    questionID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question', // Reference to the Question model
        required: true
    },
}, {
    timestamps: true
});

export const Option = mongoose.model('Option', optionSchema);