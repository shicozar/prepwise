import { Router } from 'express'
import {
  generateQuestions,
  analyzeAnswer,
  getHistory,
  getInterview,
  completeInterview
} from '../controllers/interviewController.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()

// Optional auth middleware — attaches req.user if token exists, doesn't block if not
const optionalAuth = (req, res, next) => {
  const auth = req.headers.authorization
  if (auth && auth.startsWith('Bearer ')) {
    import('jsonwebtoken').then(({ default: jwt }) => {
      try {
        req.user = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET)
      } catch (_) {}
      next()
    })
  } else {
    next()
  }
}

// Optional auth — works for guests too
router.post('/generate', optionalAuth, generateQuestions)
router.post('/analyze',  optionalAuth, analyzeAnswer)

// Protected — must be logged in
router.get('/history',        authMiddleware, getHistory)
router.get('/:id',            authMiddleware, getInterview)
router.patch('/:id/complete', authMiddleware, completeInterview)

export default router
