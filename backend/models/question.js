import mongoose from 'mongoose';

const optionSchema = new mongoose.Schema({
    optionText: {
        type: String,
        required: true,
    },
    isCorrect: {
        type: Boolean,
        required: true,
        default: false,
    },
});

const shortAnswerSchema = new mongoose.Schema({
    answerText: {
        type: String,
        required: true,
    },
});

const questionSchema = new mongoose.Schema({
    questionText: {
        type: String,
        required: true,
    },
    questionType: {
        type: String,
        enum: ['multiple-choice', 'true/false', 'short answer'],
        required: true,
    },
    quizID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true,
    },
    options: [optionSchema],
    shortAnswer: shortAnswerSchema,
}, {
    timestamps: true
});

export const Question = mongoose.model('Question', questionSchema);
export const Option = mongoose.model('Option', optionSchema);
export const ShortAnswer = mongoose.model('ShortAnswer', shortAnswerSchema);