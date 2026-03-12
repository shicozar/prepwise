// Speech controller - Full implementation on Day 3
// Will use Web Speech API on frontend + Whisper/AssemblyAI on backend

export async function transcribeAudio(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Audio file is required' })
    }

    // Day 3: Wire up Whisper API or AssemblyAI here
    // For now, return a placeholder
    res.json({
      success: true,
      transcript: '[Transcription coming on Day 3]',
      duration: 0,
      confidence: 0
    })
  } catch (err) {
    console.error('transcribeAudio error:', err)
    res.status(500).json({ error: 'Failed to transcribe audio', message: err.message })
  }
}
