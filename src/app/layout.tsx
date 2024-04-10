import type { Metadata } from 'next'
import './globals.css'

import { Plus_Jakarta_Sans as PlusJakartaSans } from 'next/font/google'
import { ReactNode } from 'react'

const jakarta = PlusJakartaSans({
  subsets: ['latin'],
  variable: '--font-jakarta',
})

export const metadata: Metadata = {
  title: {
    template: '%s - Space Sync',
    absolute: 'Space Sync',
  },
  description: 'Bot to send messages on WhatsApp',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html className={jakarta.variable} lang="pt" suppressHydrationWarning>
      <body className="bg-slate-50 antialiased">{children}</body>
    </html>
  )
}
