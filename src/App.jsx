import { useState, useRef, useEffect } from 'react'
import { SCENARIOS, STEPS, detectPhase, buildSystemPrompt, buildCoachPrompt } from './data.js'

// ── API call goes through our secure Vercel function ──────────────────────
async function callAI(system, messages) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ system, messages }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || `Server error ${res.status}`)
  return data.text
}

const fmt = (s) =>
  `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

// ── Shared style tokens ───────────────────────────────────────────────────
const C = {
  bg: '#0d1117',
  surface: '#161b22',
  border: '#30363d',
  text: '#e6edf3',
  muted: '#8b949e',
  dim: '#6e7681',
  blue: '#58a6ff',
  green: '#3fb950',
  yellow: '#e3b341',
  red: '#f85149',
  blueBg: '#1c2d47',
  greenBg: '#12261a',
  redBg: '#1e0b0b',
}

const card = {
  background: C.surface,
  border: `1px solid ${C.border}`,
  borderRadius: '12px',
  padding: '18px',
}

// ── Select Screen ─────────────────────────────────────────────────────────
function SelectScreen({ onStart }) {
  return (
    <div style={{ background: C.bg, minHeight: '100vh', color: C.text, padding: '28px 20px', fontFamily: 'system-ui,sans-serif' }}>
      <div style={{ maxWidth: 880, margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'inline-block', background: '#1f6feb22', border: `1px solid ${C.blue}`, borderRadius: 8, padding: '4px 16px', fontSize: 11, color: C.blue, letterSpacing: 1, marginBottom: 14 }}>
            CONNECTURE TRAINING SIMULATOR
          </div>
          <h1 style={{ fontSize: 30, fontWeight: 700, margin: '0 0 10px', lineHeight: 1.2 }}>
            Medicare Agent{' '}
            <span style={{ color: C.blue }}>Call Simulator</span>
          </h1>
          <p style={{ color: C.muted, fontSize: 14, maxWidth: 440, margin: '0 auto', lineHeight: 1.6 }}>
            Practice real prospect conversations with live Connecture workflow guidance.
            Pick a scenario to begin your training call.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 14, marginBottom: 18 }}>
          {SCENARIOS.map((s) => (
            <ScenarioCard key={s.id} scenario={s} onStart={onStart} />
          ))}
        </div>

        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: '12px 18px', display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          {[
            '📋 SOA required before every call',
            "🚫 Never say 'best plan'",
            "🚫 Never say 'no cost'",
            '✅ Collect DOB · ZIP · Rx · Providers',
          ].map((t) => (
            <span key={t} style={{ color: C.dim, fontSize: 11 }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

function ScenarioCard({ scenario: s, onStart }) {
  const [hover, setHover] = useState(false)
  return (
    <div
      onClick={() => onStart(s)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ ...card, cursor: 'pointer', borderColor: hover ? C.blue : C.border, transition: 'border-color .15s' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: s.diffColor, background: s.diffColor + '22', padding: '2px 10px', borderRadius: 20 }}>
          {s.difficulty}
        </span>
      </div>
      <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 6 }}>{s.label}</div>
      <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6, marginBottom: 10 }}>{s.desc}</div>
      <div style={{ color: C.dim, fontSize: 11, marginBottom: 14 }}>
        Prospect: <span style={{ color: C.muted }}>{s.persona.name}, {s.persona.age}</span>
      </div>
      <div style={{ textAlign: 'center', background: hover ? '#1f6feb' : '#1f6feb33', border: `1px solid ${C.blue}`, borderRadius: 8, padding: '8px', fontSize: 13, fontWeight: 600, color: C.blue, transition: 'background .15s' }}>
        Start Call →
      </div>
    </div>
  )
}

// ── Call Screen ───────────────────────────────────────────────────────────
function CallScreen({ scenario, onEnd }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(true)
  const [error, setError] = useState('')
  const [phase, setPhase] = useState('opening')
  const [secs, setSecs] = useState(0)
  const bottomRef = useRef(null)
  const timerRef = useRef(null)
  const taRef = useRef(null)

  useEffect(() => {
    timerRef.current = setInterval(() => setSecs((s) => s + 1), 1000)
    // Start the call — prospect answers the phone
    callAI(buildSystemPrompt(scenario), [{ role: 'user', content: 'The phone is ringing. Answer it as your character.' }])
      .then((reply) => setMessages([{ role: 'assistant', content: reply }]))
      .catch((e) => {
        setError(e.message)
        setMessages([{ role: 'assistant', content: 'Hello?' }])
      })
      .finally(() => setBusy(false))
    return () => clearInterval(timerRef.current)
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (messages.length) setPhase(detectPhase(messages))
  }, [messages])

  async function send() {
    const text = input.trim()
    if (!text || busy) return
    const next = [...messages, { role: 'user', content: text }]
    setMessages(next)
    setInput('')
    setBusy(true)
    setError('')
    try {
      const reply = await callAI(buildSystemPrompt(scenario), next)
      setMessages((p) => [...p, { role: 'assistant', content: reply }])
    } catch (e) {
      setError(e.message)
    }
    setBusy(false)
    setTimeout(() => taRef.current?.focus(), 50)
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  function handleEnd() {
    clearInterval(timerRef.current)
    onEnd(messages, secs)
  }

  const stepIdx = Math.max(STEPS.findIndex((s) => s.phase === phase), 0)
  const step = STEPS[stepIdx]

  return (
    <div style={{ background: C.bg, color: C.text, display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: 'system-ui,sans-serif' }}>
      {/* Header */}
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 14 }}>{scenario.persona.name}</div>
          <div style={{ color: C.muted, fontSize: 11 }}>{scenario.label} · ZIP {scenario.persona.zip}</div>
        </div>
        <div style={{ fontFamily: 'monospace', fontSize: 13, color: C.green, background: C.greenBg, border: `1px solid ${C.green}`, padding: '3px 10px', borderRadius: 6 }}>
          {fmt(secs)}
        </div>
        <button
          onClick={handleEnd}
          style={{ background: C.redBg, border: `1px solid ${C.red}`, borderRadius: 8, color: C.red, fontSize: 12, fontWeight: 600, padding: '6px 16px', cursor: 'pointer' }}
        >
          End Call
        </button>
      </div>

      {/* Body */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Messages + input */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {messages.map((m, i) => (
              <ChatBubble key={i} message={m} prospectName={scenario.persona.name} />
            ))}
            {busy && <TypingIndicator prospectName={scenario.persona.name} />}
            {error && (
              <div style={{ background: C.redBg, border: `1px solid ${C.red}`, borderRadius: 8, padding: '10px 14px', color: C.red, fontSize: 12 }}>
                ⚠ Error: {error}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div style={{ padding: '12px 16px', borderTop: `1px solid ${C.border}`, background: C.surface, flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
              <textarea
                ref={taRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Type your response as the agent… (Enter to send, Shift+Enter for new line)"
                rows={2}
                style={{ flex: 1, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px 12px', color: C.text, fontSize: 13, fontFamily: 'system-ui,sans-serif', resize: 'none', outline: 'none', lineHeight: 1.5 }}
              />
              <button
                onClick={send}
                disabled={busy || !input.trim()}
                style={{ background: busy || !input.trim() ? '#21262d' : C.blue, border: `1px solid ${busy || !input.trim() ? C.border : C.blue}`, borderRadius: 8, color: busy || !input.trim() ? C.dim : '#fff', padding: '10px 20px', cursor: busy || !input.trim() ? 'not-allowed' : 'pointer', fontWeight: 600, fontSize: 13, height: 54, transition: 'all .15s', minWidth: 80 }}
              >
                Send →
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <ConnectureSidebar stepIdx={stepIdx} step={step} scenario={scenario} />
      </div>
    </div>
  )
}

function ChatBubble({ message: m, prospectName }) {
  const isAgent = m.role === 'user'
  return (
    <div style={{ display: 'flex', gap: 8, flexDirection: isAgent ? 'row-reverse' : 'row', alignItems: 'flex-end' }}>
      <div style={{ width: 30, height: 30, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, background: isAgent ? '#1f6feb33' : C.greenBg, color: isAgent ? C.blue : C.green, border: `1px solid ${isAgent ? C.blue : C.green}` }}>
        {isAgent ? 'AG' : 'PT'}
      </div>
      <div style={{ maxWidth: '72%', background: isAgent ? C.blueBg : C.greenBg, border: `1px solid ${isAgent ? '#1f6feb' : '#1a472a'}`, borderRadius: isAgent ? '12px 12px 3px 12px' : '12px 12px 12px 3px', padding: '9px 13px' }}>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.5px', marginBottom: 3, color: isAgent ? C.blue : C.green }}>
          {isAgent ? 'YOU (AGENT)' : prospectName.toUpperCase()}
        </div>
        <div style={{ fontSize: 13, lineHeight: 1.6 }}>{m.content}</div>
      </div>
    </div>
  )
}

function TypingIndicator({ prospectName }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
      <div style={{ width: 30, height: 30, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, background: C.greenBg, color: C.green, border: `1px solid ${C.green}` }}>PT</div>
      <div style={{ background: C.greenBg, border: '1px solid #1a472a', borderRadius: '12px 12px 12px 3px', padding: '12px 16px', color: C.green, letterSpacing: 3, fontSize: 18 }}>• • •</div>
    </div>
  )
}

function ConnectureSidebar({ stepIdx, step, scenario }) {
  return (
    <div style={{ width: 248, borderLeft: `1px solid ${C.border}`, background: C.bg, overflowY: 'auto', flexShrink: 0, padding: 14 }}>
      <div style={{ fontSize: 9, color: C.dim, letterSpacing: 1, fontWeight: 700, marginBottom: 12 }}>CONNECTURE WORKFLOW</div>

      {STEPS.map((st, i) => {
        const done = i < stepIdx
        const cur = i === stepIdx
        return (
          <div key={st.phase} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
            <div style={{ width: 18, height: 18, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, background: done ? '#1a472a' : cur ? C.blueBg : '#21262d', border: `1px solid ${done ? C.green : cur ? C.blue : C.border}`, color: done ? C.green : cur ? C.blue : C.dim }}>
              {done ? '✓' : i + 1}
            </div>
            <div style={{ fontSize: 10, paddingTop: 3, color: done ? C.green : cur ? C.blue : C.dim, fontWeight: cur ? 700 : 400 }}>
              {st.label}
            </div>
          </div>
        )
      })}

      <div style={{ marginTop: 14, background: C.blueBg, border: `1px solid #1f6feb`, borderRadius: 8, padding: 12 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: C.blue, marginBottom: 8 }}>▸ {step.label}</div>
        {step.tips.map((t, i) => (
          <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 5 }}>
            <span style={{ color: C.dim, fontSize: 9, marginTop: 3, flexShrink: 0 }}>◆</span>
            <span style={{ fontSize: 11, color: C.muted, lineHeight: 1.5 }}>{t}</span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 8, background: C.redBg, border: `1px solid #3d1212`, borderRadius: 8, padding: 12 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: C.red, marginBottom: 7 }}>⚠ Compliance</div>
        {["Confirm SOA before presenting plans", "No 'best plan' or 'no cost'", "No guaranteed savings", "Keep scope on topic"].map((r, i) => (
          <div key={i} style={{ fontSize: 11, color: '#c9383880', marginBottom: 4, lineHeight: 1.4 }}>• {r}</div>
        ))}
      </div>

      <div style={{ marginTop: 8, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: 12 }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: C.dim, marginBottom: 8 }}>PROSPECT INFO</div>
        {[['DOB', scenario.persona.dob], ['ZIP', scenario.persona.zip], ['County', scenario.persona.county]].map(([k, v]) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
            <span style={{ fontSize: 11, color: C.dim }}>{k}</span>
            <span style={{ fontSize: 11, color: C.muted, fontFamily: 'monospace' }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Debrief Screen ────────────────────────────────────────────────────────
function DebriefScreen({ scenario, messages, duration, onRestart, onHome }) {
  const [coaching, setCoaching] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    callAI(null, [{ role: 'user', content: buildCoachPrompt(scenario, messages) }])
      .then((text) => setCoaching(text))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ background: C.bg, minHeight: '100vh', color: C.text, padding: '28px 20px', fontFamily: 'system-ui,sans-serif' }}>
      <div style={{ maxWidth: 880, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 4px' }}>Call Debrief</h2>
            <div style={{ color: C.muted, fontSize: 12 }}>{scenario.label} · {scenario.persona.name} · {fmt(duration)}</div>
          </div>
          <button onClick={onHome} style={{ background: '#21262d', border: `1px solid ${C.border}`, borderRadius: 8, color: C.muted, padding: '7px 16px', cursor: 'pointer', fontSize: 13 }}>
            ← All Scenarios
          </button>
          <button onClick={onRestart} style={{ background: C.blueBg, border: `1px solid ${C.blue}`, borderRadius: 8, color: C.blue, padding: '7px 16px', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
            ↻ Retry This Scenario
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div style={card}>
            <div style={{ fontSize: 9, color: C.dim, letterSpacing: 1, fontWeight: 700, marginBottom: 12 }}>CALL TRANSCRIPT</div>
            <div style={{ maxHeight: 420, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {messages.map((m, i) => (
                <div key={i} style={{ fontSize: 12, lineHeight: 1.6 }}>
                  <span style={{ color: m.role === 'user' ? C.blue : C.green, fontWeight: 700, fontSize: 10 }}>
                    {m.role === 'user' ? 'AGENT: ' : `${scenario.persona.name.split(' ')[0].toUpperCase()}: `}
                  </span>
                  <span style={{ color: C.muted }}>{m.content}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={card}>
            <div style={{ fontSize: 9, color: C.dim, letterSpacing: 1, fontWeight: 700, marginBottom: 12 }}>AI COACH FEEDBACK</div>
            {loading && <div style={{ color: C.dim, fontSize: 13 }}>Analyzing your call…</div>}
            {error && <div style={{ color: C.red, fontSize: 12 }}>Error: {error}</div>}
            {!loading && !error && (
              <div
                style={{ color: C.muted, fontSize: 12, lineHeight: 1.8, whiteSpace: 'pre-wrap', maxHeight: 420, overflowY: 'auto' }}
                dangerouslySetInnerHTML={{ __html: coaching.replace(/\*\*(.*?)\*\*/g, `<strong style="color:${C.text}">$1</strong>`) }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Root App ──────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState('select')
  const [scenario, setScenario] = useState(null)
  const [callMessages, setCallMessages] = useState([])
  const [callDuration, setCallDuration] = useState(0)

  function handleStart(s) {
    setScenario(s)
    setCallMessages([])
    setScreen('call')
  }

  function handleEnd(messages, duration) {
    setCallMessages(messages)
    setCallDuration(duration)
    setScreen('debrief')
  }

  if (screen === 'select') return <SelectScreen onStart={handleStart} />
  if (screen === 'call') return <CallScreen scenario={scenario} onEnd={handleEnd} />
  if (screen === 'debrief') return (
    <DebriefScreen
      scenario={scenario}
      messages={callMessages}
      duration={callDuration}
      onRestart={() => handleStart(scenario)}
      onHome={() => setScreen('select')}
    />
  )
  return null
}
