import { Header } from '@/components/Header'

export default function ContextLayout({
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
