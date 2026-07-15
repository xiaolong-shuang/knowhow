import { generateAIResponse } from '@/lib/ai'
import { trackEvent } from '@/lib/events'

export async function POST(req: Request) {
  try {
    const { question, industrySlug, history = [], industryContext, anonymousId } = await req.json()

    console.log(`[chat] anon=${anonymousId?.slice(0, 8)}... slug=${industrySlug}`)

    trackEvent({ type: 'chat', anonymousId, payload: { question: question.slice(0, 100), hasContext: !!industryContext } })

    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return Response.json({ error: 'Question is required' }, { status: 400 })
    }

    const stream = await generateAIResponse(
      question.trim(),
      industrySlug ?? null,
      history,
      undefined,
      industryContext,
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
