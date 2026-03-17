import { useState } from 'react'
import { interviewAPI } from '../services/api'
import RoleSetup       from '../components/interview/RoleSetup'
import QuestionCard    from '../components/interview/QuestionCard'
import SessionComplete from '../components/interview/SessionComplete'
import styles          from './Interview.module.css'

// Interview has 3 stages: 'setup' | 'questions' | 'complete'

export default function Interview() {
  const [stage,       setStage]       = useState('setup')
  const [role,        setRole]        = useState('')
  const [questions,   setQuestions]   = useState([])
  const [interviewId, setInterviewId] = useState(null)
  const [currentIdx,  setCurrentIdx]  = useState(0)
  const [answers,     setAnswers]     = useState([])   // { question, analysis }
  const [generating,  setGenerating]  = useState(false)
  const [submitting,  setSubmitting]  = useState(false)
  const [error,       setError]       = useState('')

  // ── Stage 1: Generate questions ─────────────────────
  const handleStart = async (selectedRole, count) => {
    setError('')
    setGenerating(true)
    try {
      const res = await interviewAPI.generate(selectedRole, count)
      setRole(selectedRole)
      setQuestions(res.data.questions)
      setInterviewId(res.data.interviewId)
      setAnswers(Array(res.data.questions.length).fill(null))
      setCurrentIdx(0)
      setStage('questions')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate questions. Check your API key.')
    } finally {
      setGenerating(false)
    }
  }

  // ── Stage 2: Submit answer for analysis ─────────────
  const handleSubmitAnswer = async (transcript) => {
    setSubmitting(true)
    setError('')
    try {
      const q   = questions[currentIdx]
      const res = await interviewAPI.analyze({
        question:    q.question,
        answer:      transcript,
        role,
        interviewId,
        questionId:  q.id,
      })

      const newAnswers = [...answers]
      newAnswers[currentIdx] = { question: q.question, analysis: res.data.analysis }
      setAnswers(newAnswers)
    } catch (err) {
      setError('Failed to analyze answer. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // ── Navigate questions ───────────────────────────────
  const goNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(i => i + 1)
    } else {
      handleComplete()
    }
  }

  const goPrev = () => {
    if (currentIdx > 0) setCurrentIdx(i => i - 1)
  }

  // ── Stage 3: Complete session ────────────────────────
  const handleComplete = async () => {
    if (interviewId) {
      const scored = answers.filter(a => a?.analysis?.score)
      const avg    = scored.length
        ? Math.round(scored.reduce((s, a) => s + a.analysis.score, 0) / scored.length * 10) / 10
        : 0
      try { await interviewAPI.complete(interviewId, avg) } catch (_) {}
    }
    setStage('complete')
  }

  const handleRestart = () => {
    setStage('setup')
    setRole('')
    setQuestions([])
    setInterviewId(null)
    setCurrentIdx(0)
    setAnswers([])
    setError('')
  }

  const currentAnswer    = answers[currentIdx]
  const isAnswered       = !!currentAnswer
  const allDone          = answers.every(a => a !== null)

  return (
    <main className={styles.main}>
      <div className={styles.container}>

        {error && (
          <div className={styles.error}>{error}</div>
        )}

        {stage === 'setup' && (
          <RoleSetup onStart={handleStart} loading={generating} />
        )}

        {stage === 'questions' && questions.length > 0 && (
          <>
            <QuestionCard
              key={currentIdx}
              question={questions[currentIdx]}
              index={currentIdx}
              total={questions.length}
              onSubmitAnswer={handleSubmitAnswer}
              submitting={submitting}
              submitted={isAnswered}
              analysis={currentAnswer?.analysis}
            />

            {/* Navigation */}
            <div className={styles.nav}>
              <button
                className={styles.navBtn}
                onClick={goPrev}
                disabled={currentIdx === 0}
              >
                ← Previous
              </button>

              <div className={styles.dots}>
                {questions.map((_, i) => (
                  <button
                    key={i}
                    className={`${styles.dot} ${i === currentIdx ? styles.dotActive : ''} ${answers[i] ? styles.dotDone : ''}`}
                    onClick={() => setCurrentIdx(i)}
                  />
                ))}
              </div>

              {isAnswered && (
                <button className={styles.navBtnPrimary} onClick={goNext}>
                  {currentIdx === questions.length - 1
                    ? allDone ? 'Finish Interview →' : 'See Results →'
                    : 'Next Question →'}
                </button>
              )}

              {!isAnswered && (
                <button
                  className={styles.navBtnSkip}
                  onClick={() => {
                    const newAnswers = [...answers]
                    newAnswers[currentIdx] = { question: questions[currentIdx].question, analysis: null, skipped: true }
                    setAnswers(newAnswers)
                  }}
                >
                  Skip
                </button>
              )}
            </div>
          </>
        )}

        {stage === 'complete' && (
          <SessionComplete
            role={role}
            answers={answers.filter(a => a && a.analysis)}
            onRestart={handleRestart}
          />
        )}
      </div>
    </main>
  )
}
