import mongoose from 'mongoose'

const questionSchema = new mongoose.Schema({
  role:       { type: String, required: true, index: true },
  question:   { type: String, required: true },
  category:   { type: String, enum: ['Technical', 'Behavioral', 'System Design', 'Problem Solving'] },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'] },
  hint:       String,
  timesAsked: { type: Number, default: 0 },
}, { timestamps: true })

export default mongoose.model('Question', questionSchema)
