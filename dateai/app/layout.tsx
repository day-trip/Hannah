import './globals.css'
import type { Metadata } from 'next'
import React from "react";

export const metadata: Metadata = {
  title: 'Hannah',
  description: 'An AI powered simple dating application for schools',
  keywords: ["dating", "date", "edate", "ai", "chatbot", "school"],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
