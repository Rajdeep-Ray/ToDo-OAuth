const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const todoSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    isTrash: {
        type: Boolean,
        default: false
    },
    isDone: {
        type: Boolean,
        default: false
    },
    account: {
        type: mongoose.Types.ObjectId,
        ref:'User'
    }
})

module.exports = mongoose.model('To-Dos', todoSchema);