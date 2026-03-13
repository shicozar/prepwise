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

// Public (guest mode supported) — auth optional
router.post('/generate', (req, res, next) => {
  // Attach user if token exists, but don't block if not
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
})
router.post('/generate', generateQuestions)
router.post('/analyze',  analyzeAnswer)

// Protected — must be logged in
router.get('/history',        authMiddleware, getHistory)
router.get('/:id',            authMiddleware, getInterview)
router.patch('/:id/complete', authMiddleware, completeInterview)

export default router
