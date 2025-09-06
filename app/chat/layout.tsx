import AppHeader from '@/components/app-header'
import Composer from '@/components/composer'

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <AppHeader />
      {children}
      <Composer />
    </>
  )
}