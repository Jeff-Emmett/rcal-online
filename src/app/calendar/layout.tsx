import { Header } from '@/components/Header'
import { TimezoneSync } from '@/components/TimezoneSync'

export default function CalendarLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header current="cal" />
      <TimezoneSync />
      {children}
    </>
  )
}
