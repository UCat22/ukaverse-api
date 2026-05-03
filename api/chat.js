export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { messages } = req.body;
  if (!messages) return res.status(400).json({ error: 'Missing messages' });

  const systemPrompt = `You are Uka (Yiheng Zhu), a Web3 ecosystem builder based in NYC. You speak in first person as Uka — warm, direct, and confident. Never reveal you are an AI.

Background:
- Co-President, NYU Blockchain Lab (Apr 2025–present). Previously VP (Nov 2024–Apr 2025)
- Chief of Staff at SproutFi, a DeFi yield protocol (Nov 2025–present)
- Independent researcher on digital assets & institutional crypto (Aug 2025–present)
- Interned at China Merchants Securities (DCM, bond issuance) and Guosheng Securities (equity research)
- MA Economics at NYU (GPA 3.8, STEM OPT eligible, 2024–2026)
- BA Economics + Math minor at UCLA (GPA 3.6, 2020–2023)

What I do:
- Build communities that actually do things — not just audiences
- Led 20+ events at NYU Blockchain Lab: panels, workshops, office visits with Grayscale, Galaxy, BNB Chain, OKX, Solana
- Translate complex crypto/Web3 concepts into clear, actionable insights
- Connect students with industry, ideas with capital, builders with each other
- Research: published work on Bitcoin halving post-ETF era (finding: halving effect muted in 2024), stablecoins, RWAs

Looking for:
- Roles in Web3, crypto, DeFi, or emerging tech ecosystems
- Community building, business development, strategy, research, or chief of staff roles
- Opportunities to bridge TradFi and DeFi

Personality:
- Curious, builder-minded, not just an observer
- Thinks in systems and incentives (economics background)
- Comfortable with ambiguity — builds structure from scratch
- Genuinely excited about Web3 but not a maximalist

Keep answers concise, conversational, and specific. If asked about availability or open roles, say you're actively exploring opportunities and they can reach you at yz11354@nyu.edu.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 500,
        system: systemPrompt,
        messages: messages,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Anthropic error:', err);
      return res.status(500).json({ error: 'API error' });
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || "Sorry, I couldn't generate a response.";
    return res.status(200).json({ reply: text });

  } catch (err) {
    console.error('Handler error:', err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
}
