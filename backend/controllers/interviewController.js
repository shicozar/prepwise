import Anthropic from '@anthropic-ai/sdk'
import Interview from '../models/Interview.js'
import Question from '../models/Question.js'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// ── POST /api/interview/generate ────────────────────────
export async function generateQuestions(req, res) {
  try {
    const { role, count = 5 } = req.body
    if (!role) return res.status(400).json({ error: 'Role is required' })

    const prompt = `You are an expert technical interviewer. Generate ${count} realistic interview questions for a "${role}" position.

These should reflect questions actually asked at top tech companies, drawn from real job posting requirements.

Return ONLY a JSON array with this structure:
[
  {
    "id": "q1",
    "question": "...",
    "category": "Technical" | "Behavioral" | "System Design" | "Problem Solving",
    "difficulty": "Easy" | "Medium" | "Hard",
    "hint": "Brief hint about what a good answer covers"
  }
]

No extra text, just valid JSON.`

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }]
    })

    const raw = message.content[0].text.trim()
    const questions = JSON.parse(raw)

    // Save questions to question bank
    for (const q of questions) {
      await Question.findOneAndUpdate(
        { role, question: q.question },
        { role, question: q.question, category: q.category, difficulty: q.difficulty, hint: q.hint, $inc: { timesAsked: 1 } },
        { upsert: true }
      )
    }

    // Create interview session if logged in
    let interviewId = null
    if (req.user) {
      const interview = await Interview.create({
        userId: req.user.id,
        role,
        questions,
        status: 'in_progress'
      })
      interviewId = interview._id
    }

    res.json({ success: true, role, questions, interviewId })
  } catch (err) {
    console.error('generateQuestions error:', err)
    res.status(500).json({ error: 'Failed to generate questions', message: err.message })
  }
}

// ── POST /api/interview/analyze ─────────────────────────
export async function analyzeAnswer(req, res) {
  try {
    const { question, answer, role, interviewId, questionId } = req.body
    if (!question || !answer) return res.status(400).json({ error: 'Question and answer are required' })

    const prompt = `You are an expert interview coach reviewing a candidate's answer for a "${role}" position.

Question: "${question}"
Candidate's Answer: "${answer}"

Analyze the answer and respond ONLY with valid JSON:
{
  "score": <number 1-10>,
  "summary": "<2-sentence overall assessment>",
  "strengths": ["<strength 1>", "<strength 2>"],
  "improvements": ["<improvement 1>", "<improvement 2>"],
  "suggestedAnswer": "<A concise example of an excellent answer>",
  "keywords": ["<relevant keyword 1>", "<relevant keyword 2>"]
}`

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }]
    })

    const raw = message.content[0].text.trim()
    const analysis = JSON.parse(raw)

    // Save to MongoDB if logged in
    if (interviewId && req.user) {
      await Interview.findByIdAndUpdate(interviewId, {
        $push: { answers: { questionId, question, analysis } }
      })
    }

    res.json({ success: true, analysis })
  } catch (err) {
    console.error('analyzeAnswer error:', err)
    res.status(500).json({ error: 'Failed to analyze answer', message: err.message })
  }
}

// ── GET /api/interview/history ───────────────────────────
export async function getHistory(req, res) {
  try {
    const interviews = await Interview.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .select('role overallScore status createdAt answers')
      .limit(20)
    res.json({ success: true, interviews })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch history' })
  }
}

// ── GET /api/interview/:id ───────────────────────────────
export async function getInterview(req, res) {
  try {
    const interview = await Interview.findOne({ _id: req.params.id, userId: req.user.id })
    if (!interview) return res.status(404).json({ error: 'Interview not found' })
    res.json({ success: true, interview })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch interview' })
  }
}

// ── PATCH /api/interview/:id/complete ───────────────────
export async function completeInterview(req, res) {
  try {
    const { overallScore } = req.body
    const interview = await Interview.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { status: 'completed', overallScore, completedAt: new Date() },
      { new: true }
    )
    res.json({ success: true, interview })
  } catch (err) {
    res.status(500).json({ error: 'Failed to complete interview' })
  }
}
