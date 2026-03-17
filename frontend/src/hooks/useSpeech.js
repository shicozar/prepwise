import { useState, useRef, useCallback } from 'react'

export function useSpeech() {
  const [transcript, setTranscript]   = useState('')
  const [listening,  setListening]    = useState(false)
  const [supported,  setSupported]    = useState(true)
  const recognitionRef                = useRef(null)

  const start = useCallback(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      setSupported(false)
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous      = true
    recognition.interimResults  = true
    recognition.lang            = 'en-US'

    recognition.onstart = () => setListening(true)

    recognition.onresult = (e) => {
      let final = ''
      for (let i = 0; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript + ' '
      }
      setTranscript(final.trim())
    }

    recognition.onerror = (e) => {
      console.error('Speech error:', e.error)
      setListening(false)
    }

    recognition.onend = () => setListening(false)

    recognitionRef.current = recognition
    recognition.start()
  }, [])

  const stop = useCallback(() => {
    recognitionRef.current?.stop()
    setListening(false)
  }, [])

  const reset = useCallback(() => {
    recognitionRef.current?.stop()
    setTranscript('')
    setListening(false)
  }, [])

  return { transcript, listening, supported, start, stop, reset, setTranscript }
}
