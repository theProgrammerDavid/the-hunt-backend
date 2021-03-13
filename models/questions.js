const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create Question Schema & model
const QuestionSchema = new Schema({
    number:Number,
    answer:String
    });

const Question = mongoose.model('question',QuestionSchema);
module.exports = Question;