const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create Question Schema & model
const QuestionSchema = new Schema({
    qno:Number,
    ans:String
    });

const Question = mongoose.model('question',QuestionSchema);
module.exports = Question;