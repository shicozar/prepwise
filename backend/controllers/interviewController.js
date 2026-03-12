import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// ── Generate interview questions ─────────────────────────
export async function generateQuestions(req, res) {
  try {
    const { role, count = 5 } = req.body

    if (!role) {
      return res.status(400).json({ error: 'Role is required' })
    }

    const prompt = `You are an expert technical interviewer. Generate ${count} realistic interview questions for a "${role}" position.

These should reflect questions actually asked at top tech companies, drawn from real job posting requirements.

Return ONLY a JSON array of objects with this structure:
[
  {
    "id": 1,
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

    res.json({ success: true, role, questions })
  } catch (err) {
    console.error('generateQuestions error:', err)
    res.status(500).json({ error: 'Failed to generate questions', message: err.message })
  }
}

// ── Analyze a user's answer ──────────────────────────────
export async function analyzeAnswer(req, res) {
  try {
    const { question, answer, role } = req.body

    if (!question || !answer) {
      return res.status(400).json({ error: 'Question and answer are required' })
    }

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

    res.json({ success: true, analysis })
  } catch (err) {
    console.error('analyzeAnswer error:', err)
    res.status(500).json({ error: 'Failed to analyze answer', message: err.message })
  }
}
