import { Router } from 'express'
import multer from 'multer'
import { transcribeAudio } from '../controllers/speechController.js'

const storage = multer.memoryStorage()
const upload = multer({ storage, limits: { fileSize: 25 * 1024 * 1024 } }) // 25MB

const router = Router()

// POST /api/speech/transcribe
// Form-data: { audio: <file> }
router.post('/transcribe', upload.single('audio'), transcribeAudio)

export default router
