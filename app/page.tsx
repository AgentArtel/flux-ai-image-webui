import { redirect } from 'next/navigation'
import { defaultLocale } from '@/config/site'

// This page only renders if middleware.ts fails
export default function RootPage() {
  redirect(`/${defaultLocale}`)
}
