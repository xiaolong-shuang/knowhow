import { generateAIResponse } from '@/lib/ai'

export async function POST(req: Request) {
  try {
    const { question, industrySlug, history = [] } = await req.json()

    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return Response.json({ error: 'Question is required' }, { status: 400 })
    }

    const stream = await generateAIResponse(
      question.trim(),
      industrySlug ?? null,
      history,
    )

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    })
  } catch (e) {
    console.error('Chat API error:', e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
