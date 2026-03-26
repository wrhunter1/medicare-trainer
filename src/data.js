export const SCENARIOS = [
  {
    id: 't65',
    label: 'Turning 65',
    difficulty: 'Beginner',
    diffColor: '#3fb950',
    desc: 'First-time Medicare enrollee. Confused about Part A vs B. Wants to keep her doctor.',
    persona: {
      name: 'Margaret Collins',
      age: 64,
      dob: 'April 3, 1961',
      zip: '32256',
      county: 'Duval',
      state: 'FL',
      bg: 'Retiring schoolteacher who has been on her husband\'s employer plan for 20 years. She is friendly but nervous and confused about how Medicare works. She is on a fixed income and very budget-conscious.',
      concerns: 'worried about picking the wrong plan; confused about Part A vs Part B; wants to keep her cardiologist Dr. Patel; fixed income and budget is important',
      tone: 'friendly but anxious, asks a lot of clarifying questions, appreciates patience',
    },
  },
  {
    id: 'emp',
    label: 'Losing Employer Coverage',
    difficulty: 'Intermediate',
    diffColor: '#e3b341',
    desc: 'Just retired. Coverage ends in 30 days. Worried about late enrollment penalties.',
    persona: {
      name: 'Robert Tanner',
      age: 67,
      dob: 'January 15, 1958',
      zip: '32207',
      county: 'Duval',
      state: 'FL',
      bg: 'Just retired from a manufacturing company. His employer coverage ends in 30 days. He delayed enrolling in Medicare when he first turned 65 and is now worried about late enrollment penalties. He is impatient and direct.',
      concerns: 'worried about late enrollment penalties; coverage ending in 30 days is urgent; needs drug coverage (takes metformin and lisinopril); does not fully understand SEP rules',
      tone: 'impatient and direct, wants fast clear answers, slightly skeptical of insurance agents',
    },
  },
  {
    id: 'aep',
    label: 'AEP Plan Switcher',
    difficulty: 'Intermediate',
    diffColor: '#e3b341',
    desc: 'Current MA member. Premium went up $40, doctor left network. Ready to switch.',
    persona: {
      name: 'Dorothy Simmons',
      age: 72,
      dob: 'September 22, 1953',
      zip: '32204',
      county: 'Duval',
      state: 'FL',
      bg: 'Has been on a Humana HMO for 3 years. Her monthly premium went up $40 and her primary care doctor recently left the network. She is frustrated and wants to switch but does not fully understand how HMO networks work.',
      concerns: 'premium increased by $40/month; primary doctor left the network; wants a PPO so she can see any doctor; frustrated with her current insurer',
      tone: 'frustrated and ready to switch, needs reassurance, warms up when she feels heard',
    },
  },
  {
    id: 'dsnp',
    label: 'Dual Eligible (D-SNP)',
    difficulty: 'Advanced',
    diffColor: '#f85149',
    desc: 'Has Medicare and Medicaid. Qualifies for D-SNP. Needs transportation and dental.',
    persona: {
      name: 'Gloria Washington',
      age: 69,
      dob: 'March 7, 1956',
      zip: '32209',
      county: 'Duval',
      state: 'FL',
      medicaidId: 'FL-8847291',
      bg: 'Has both Medicare Part A and B and full Medicaid (QMB). She lives alone and does not drive. She is very interested in plans that include transportation and dental benefits. English is her second language and she needs things explained simply and slowly.',
      concerns: 'needs transportation benefit because she has no car; wants dental and vision coverage; currently pays nothing due to QMB status and worried about any new costs; unfamiliar with insurance terminology',
      tone: 'soft-spoken and gentle, needs simple plain language, sometimes asks you to repeat things, appreciates patience',
    },
  },
  {
    id: 'resistant',
    label: 'Skeptical and Resistant',
    difficulty: 'Advanced',
    diffColor: '#f85149',
    desc: 'Burned by a pushy agent before. Defensive. Tests your compliance and trust-building.',
    persona: {
      name: 'Frank Kowalski',
      age: 70,
      dob: 'November 30, 1955',
      zip: '32218',
      county: 'Duval',
      state: 'FL',
      bg: 'A retired plumber who had a bad experience with a pushy insurance agent in the past. He is currently on Original Medicare with a Medigap supplement. He saw a TV commercial about $0 premium Medicare Advantage plans and is calling to ask about it, but he is very defensive and suspicious.',
      concerns: 'does not trust insurance agents in general; curious about $0 premium plans he saw on TV; his current supplement premium feels high; afraid of being pushed into something he does not want',
      tone: 'defensive and guarded, tests the agent with hard questions, pushes back when asked for personal info, warms up slowly if the agent is patient and transparent',
    },
  },
]

export const STEPS = [
  {
    phase: 'opening',
    label: '1. Start Quote',
    tips: [
      'Log into Connecture DrFirst',
      "Click 'New Quote' from dashboard",
      'Complete discovery BEFORE quoting',
    ],
  },
  {
    phase: 'discovery',
    label: '2. Enter Demographics',
    tips: [
      'Enter ZIP code and county',
      'Enter date of birth',
      'Select effective date',
      'Confirm Part A and Part B dates',
    ],
  },
  {
    phase: 'rx',
    label: '3. Add Prescriptions',
    tips: [
      "Click 'Drug List' tab",
      'Search each medication by name',
      'Confirm dosage and frequency',
      'Select preferred pharmacy',
    ],
  },
  {
    phase: 'providers',
    label: '4. Add Providers',
    tips: [
      "Click 'Provider' tab",
      'Search by name or NPI number',
      'Verify in-network for each plan',
      'Flag plans that exclude key doctors',
    ],
  },
  {
    phase: 'quoting',
    label: '5. Present Quotes',
    tips: [
      "Click 'View Plans'",
      'Sort by Total Estimated Annual Cost',
      'Filter HMO or PPO if needed',
      'Present 2 to 3 plans maximum',
    ],
  },
  {
    phase: 'enrollment',
    label: '6. Enroll',
    tips: [
      "Click 'Enroll' on chosen plan",
      'Confirm SOA is on file',
      'Fill all required fields (red asterisks)',
      'Review summary with prospect before submitting',
    ],
  },
]

export const PHASE_KEYWORDS = {
  opening: ['hello', 'hi', 'calling', 'my name', 'speaking', 'how are you'],
  discovery: ['birthday', 'date of birth', 'zip', 'county', 'part a', 'part b', 'medicaid', 'enrolled', 'coverage starts', 'effective'],
  rx: ['medication', 'prescription', 'drug', 'pharmacy', 'pills', 'dose', 'taking', 'prescriptions'],
  providers: ['doctor', 'physician', 'specialist', 'hospital', 'provider', 'dr.', 'network', 'keep my doctor'],
  quoting: ['plan', 'option', 'compare', 'quote', 'premium', 'cost', 'benefit', 'recommend', 'show you', 'hmo', 'ppo'],
  enrollment: ['enroll', 'sign up', 'apply', 'effective date', 'choose', 'go with', 'that plan', 'start coverage'],
}

export function detectPhase(messages) {
  if (messages.length < 2) return 'opening'
  const text = messages
    .slice(-6)
    .map((m) => m.content.toLowerCase())
    .join(' ')
  const order = ['enrollment', 'quoting', 'providers', 'rx', 'discovery', 'opening']
  return order.find((p) => PHASE_KEYWORDS[p].some((k) => text.includes(k))) || 'opening'
}

export function buildSystemPrompt(scenario) {
  return `You are ${scenario.persona.name}, a Medicare prospect on a simulated phone call with a new insurance agent who is in training.

BACKGROUND: ${scenario.persona.bg}

YOUR PERSONAL INFORMATION — only share each item when the agent specifically asks for it:
- Full name: ${scenario.persona.name}
- Date of birth: ${scenario.persona.dob}
- ZIP code: ${scenario.persona.zip}
- County: ${scenario.persona.county}, ${scenario.persona.state}${scenario.persona.medicaidId ? `\n- Medicaid ID: ${scenario.persona.medicaidId}` : ''}

YOUR CONCERNS: ${scenario.persona.concerns}

YOUR TONE: ${scenario.persona.tone}

RULES YOU MUST FOLLOW:
1. Stay completely in character at all times. Never break character or acknowledge this is a simulation.
2. Keep every reply to 2 to 4 sentences. This is a phone call — be conversational, not robotic.
3. Only share your personal information when the agent directly asks for that specific piece of information.
4. Bring up your concerns naturally throughout the conversation — do not wait to be asked.
5. If the agent uses insurance jargon without explaining it, ask what it means.
6. If the agent seems pushy, skips your concerns, or rushes you, push back naturally.
7. If the agent handles something well — explains clearly, addresses your concern, shows patience — respond warmly.
8. Do not mention Connecture or any software. You are just a prospect on the phone.
9. When the agent confirms enrollment details or clear next steps, thank them and end the call naturally.`
}

export function buildCoachPrompt(scenario, messages) {
  const transcript = messages
    .map((m) => `${m.role === 'user' ? 'AGENT' : 'PROSPECT'}: ${m.content}`)
    .join('\n')

  return `You are an experienced Medicare insurance training coach. Review this simulated practice call and provide a detailed debrief.

SCENARIO: ${scenario.label}
PROSPECT: ${scenario.persona.name}, age ${scenario.persona.age}
PROSPECT BACKGROUND: ${scenario.persona.bg}
KEY CONCERNS THE PROSPECT HAD: ${scenario.persona.concerns}

CALL TRANSCRIPT:
${transcript}

Write your coaching debrief using EXACTLY this format:

**Overall Score: X/10**

**What the agent did well:**
List specific things the agent did well with examples from the transcript. Be specific — reference actual things they said.

**Areas to improve:**
List specific gaps or mistakes with examples. Be direct but constructive.

**Compliance check:**
- Did the agent confirm a Scope of Appointment (SOA) before presenting plans?
- Did the agent avoid using the words "best," "free," or making guarantees?
- Did the agent ask about current coverage before jumping into quoting?

**Connecture readiness:**
What information did the agent successfully collect that they would need to complete a Connecture quote? What was still missing (date of birth, ZIP, medications, preferred pharmacy, doctors)?

**One thing to focus on next time:**
A single, specific, actionable piece of advice for this agent.

Be honest, direct, and supportive. This agent is new and learning.`
}
