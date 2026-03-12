import { Router } from 'express'
import {
  generateQuestions,
  analyzeAnswer
} from '../controllers/interviewController.js'

const router = Router()

// POST /api/interview/generate
// Body: { role: "Java Backend Developer", count: 5 }
router.post('/generate', generateQuestions)

// POST /api/interview/analyze
// Body: { question: "...", answer: "...", role: "..." }
router.post('/analyze', analyzeAnswer)

export default router
