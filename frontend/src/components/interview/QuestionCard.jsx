import { useEffect } from 'react'
import { useSpeech } from '../../hooks/useSpeech'
import styles from './QuestionCard.module.css'

const CATEGORY_COLORS = {
  'Technical':      { bg: '#EAF2F8', color: '#1B4F72' },
  'Behavioral':     { bg: '#EAF4EE', color: '#1E8449' },
  'System Design':  { bg: '#F4ECF7', color: '#7D3C98' },
  'Problem Solving':{ bg: '#FEF9E7', color: '#B7950B' },
}

const DIFFICULTY_COLORS = {
  Easy:   { bg: '#EAFAF1', color: '#1E8449' },
  Medium: { bg: '#FEF9E7', color: '#B7950B' },
  Hard:   { bg: '#FDEDEC', color: '#C0392B' },
}

export default function QuestionCard({
  question, index, total,
  onSubmitAnswer, submitting, submitted, analysis
}) {
  const { transcript, listening, supported, start, stop, reset, setTranscript } = useSpeech()

  // Reset speech when question changes
  useEffect(() => { reset() }, [question.id])

  const catStyle  = CATEGORY_COLORS[question.category]  || { bg: '#F4F6F9', color: '#555' }
  const diffStyle = DIFFICULTY_COLORS[question.difficulty] || { bg: '#F4F6F9', color: '#555' }

  const handleSubmit = () => {
    if (transcript.trim()) onSubmitAnswer(transcript)
  }

  return (
    <div className={styles.wrap}>
      {/* Progress bar */}
      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${((index + 1) / total) * 100}%` }}
        />
      </div>

      <div className={styles.card}>
        {/* Header row */}
        <div className={styles.headerRow}>
          <span className={styles.qNum}>Question {index + 1} of {total}</span>
          <div className={styles.badges}>
            <span className={styles.badge} style={{ background: catStyle.bg, color: catStyle.color }}>
              {question.category}
            </span>
            <span className={styles.badge} style={{ background: diffStyle.bg, color: diffStyle.color }}>
              {question.difficulty}
            </span>
          </div>
        </div>

        {/* Question */}
        <p className={styles.question}>{question.question}</p>

        {/* Hint */}
        {question.hint && !submitted && (
          <div className={styles.hint}>
            <span className={styles.hintLabel}>💡 Hint</span>
            <span className={styles.hintText}>{question.hint}</span>
          </div>
        )}

        {/* ── Recorder ───────────────────────────── */}
        {!submitted && (
          <div className={styles.recorder}>
            {!supported && (
              <p className={styles.unsupported}>
                Speech recognition not supported in this browser. Please use Chrome.
              </p>
            )}

            {supported && (
              <>
                <div className={styles.transcriptBox}>
                  {transcript
                    ? <p className={styles.transcriptText}>{transcript}</p>
                    : <p className={styles.transcriptPlaceholder}>
                        {listening ? 'Listening… speak your answer' : 'Your answer will appear here as you speak'}
                      </p>
                  }
                  {listening && <span className={styles.liveDot} />}
                </div>

                <div className={styles.recorderBtns}>
                  {!listening ? (
                    <button className={styles.recordBtn} onClick={start}>
                      🎙️ {transcript ? 'Continue Recording' : 'Start Recording'}
                    </button>
                  ) : (
                    <button className={`${styles.recordBtn} ${styles.recording}`} onClick={stop}>
                      ⏹ Stop Recording
                    </button>
                  )}
                  {transcript && (
                    <button className={styles.resetBtn} onClick={reset}>Clear</button>
                  )}
                </div>

                {/* Manual text fallback */}
                {!listening && (
                  <textarea
                    className={styles.textFallback}
                    placeholder="Or type your answer here…"
                    value={transcript}
                    onChange={e => setTranscript(e.target.value)}
                    rows={3}
                  />
                )}

                <button
                  className={styles.submitBtn}
                  disabled={!transcript.trim() || submitting}
                  onClick={handleSubmit}
                >
                  {submitting ? (
                    <span className={styles.loadingRow}>
                      <span className={styles.spinner} /> Analysing with AI…
                    </span>
                  ) : 'Submit Answer for Analysis →'}
                </button>
              </>
            )}
          </div>
        )}

        {/* ── AI Analysis ─────────────────────────── */}
        {submitted && analysis && (
          <div className={styles.analysis}>
            <div className={styles.analysisHeader}>
              <span className={styles.analysisTitle}>AI Feedback</span>
              <div className={styles.scoreCircle} style={{
                background: analysis.score >= 8 ? '#EAF4EE' : analysis.score >= 5 ? '#FEF9E7' : '#FDEDEC',
                color: analysis.score >= 8 ? '#1E8449' : analysis.score >= 5 ? '#B7950B' : '#C0392B',
              }}>
                {analysis.score}<span className={styles.scoreOf}>/10</span>
              </div>
            </div>

            <p className={styles.summary}>{analysis.summary}</p>

            <div className={styles.feedbackGrid}>
              <div className={styles.feedbackBox} style={{ background: '#EAF4EE' }}>
                <div className={styles.feedbackLabel} style={{ color: '#1E8449' }}>✓ Strengths</div>
                {analysis.strengths.map((s, i) => (
                  <div key={i} className={styles.feedbackItem}>{s}</div>
                ))}
              </div>
              <div className={styles.feedbackBox} style={{ background: '#FEF9E7' }}>
                <div className={styles.feedbackLabel} style={{ color: '#B7950B' }}>↑ Improvements</div>
                {analysis.improvements.map((imp, i) => (
                  <div key={i} className={styles.feedbackItem}>{imp}</div>
                ))}
              </div>
            </div>

            {analysis.keywords?.length > 0 && (
              <div className={styles.keywords}>
                <span className={styles.keywordsLabel}>Key terms to include:</span>
                {analysis.keywords.map(k => (
                  <span key={k} className={styles.keyword}>{k}</span>
                ))}
              </div>
            )}

            <details className={styles.modelAnswer}>
              <summary className={styles.modelAnswerToggle}>View model answer</summary>
              <p className={styles.modelAnswerText}>{analysis.suggestedAnswer}</p>
            </details>

            {/* Show what they said */}
            <details className={styles.yourAnswer}>
              <summary className={styles.yourAnswerToggle}>Your answer (transcript)</summary>
              <p className={styles.yourAnswerText}>{transcript}</p>
            </details>
          </div>
        )}
      </div>
    </div>
  )
}
