import mongoose from 'mongoose'

const pollSchema = new mongoose.Schema({
    question:{
        type: String,
        required: true
    },
    options:[
        {
            text: String,
            votes: {
                type: Number,
                default: 0
            }
        }
    ],
    voters:[String],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const Poll = mongoose.model('Poll', pollSchema);