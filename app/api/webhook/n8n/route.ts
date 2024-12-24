import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const { 
      webhook_id,
      image_url,
      status,
      error,
      user_id 
    } = json

    // Initialize Supabase client
    const supabase = createRouteHandlerClient({ cookies })

    // Update generation status in database
    const { data, error: dbError } = await supabase
      .from('generations')
      .update({ 
        status: status || (error ? 'failed' : 'completed'),
        image_url,
        error: error || null,
        completed_at: new Date().toISOString()
      })
      .eq('webhook_id', webhook_id)
      .eq('user_id', user_id)
      .select()
      .single()

    if (dbError) throw dbError

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
