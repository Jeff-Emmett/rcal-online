import { Header } from '@/components/Header'

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header current="cal" />
      {children}
    </>
  )
}
