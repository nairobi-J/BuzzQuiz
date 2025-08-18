import mongoose from 'mongoose';


const responseSchema = new mongoose.Schema({
    prompt: {type: String, required: true},
    response: {type: String, required: true},
    createdAt: {type: Date, default:Date.now}
})

export default Response = mongoose.model('Response', responseSchema);