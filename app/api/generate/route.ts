import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const { prompt, negativePrompt, steps, width, height, model } = json

    // Get authenticated user using our server client
    const session = await createServerSupabaseClient()
    const user = await session.auth.getUser()

    if (!user.data.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Generate a unique filename
    const timestamp = new Date().getTime()
    const filename = `${user.data.user.id}/${timestamp}.png`

    // Call n8n webhook
    const response = await fetch(process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        negative_prompt: negativePrompt,
        steps: steps || 20,
        width: width || 512,
        height: height || 512,
        user_id: user.data.user.id,
        filename: filename,
        supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        supabase_key: process.env.SUPABASE_SERVICE_ROLE_KEY,
        model: model || 'flux.1'
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to generate image')
    }

    const result = await response.json()

    // Store generation request in Supabase
    const { data: generation, error } = await session
      .from('generations')
      .insert({
        user_id: user.data.user.id,
        prompt,
        negative_prompt: negativePrompt,
        steps,
        width,
        height,
        model: model || 'flux.1',
        status: 'completed',
        output_url: result.imageUrl || null
      })
      .select()
      .single()

    if (error) {
      console.error('Error storing generation:', error)
      // Continue even if storage fails
    }

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Generation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate image' },
      { status: 500 }
    )
  }
}
