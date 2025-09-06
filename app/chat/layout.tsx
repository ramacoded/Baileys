import AppHeader from '@/components/app-header'
import Composer from '@/components/composer'

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex h-screen w-full flex-col">
      <AppHeader />
      {children}
      <Composer />
    </div>
  )
}