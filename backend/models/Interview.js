import mongoose from 'mongoose'

const answerSchema = new mongoose.Schema({
  questionId:  String,
  question:    String,
  category:    String,
  difficulty:  String,
  transcript:  String,          // speech-to-text result
  analysis: {
    score:           Number,
    summary:         String,
    strengths:       [String],
    improvements:    [String],
    suggestedAnswer: String,
    keywords:        [String],
  },
  answeredAt: { type: Date, default: Date.now }
})

const interviewSchema = new mongoose.Schema({
  userId:     { type: Number, required: true },   // references PostgreSQL users.id
  role:       { type: String, required: true },
  questions:  [{ id: String, question: String, category: String, difficulty: String, hint: String }],
  answers:    [answerSchema],
  overallScore: Number,
  status:     { type: String, enum: ['in_progress', 'completed'], default: 'in_progress' },
  completedAt: Date,
}, { timestamps: true })

export default mongoose.model('Interview', interviewSchema)
