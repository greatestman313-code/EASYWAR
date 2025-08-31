import Sidebar from '@/components/sidebar/Sidebar'
import ChatHeader from '@/components/header/ChatHeader'
import MessageList from '@/components/chat/MessageList'
import MessageInput from '@/components/chat/MessageInput'

export default function ChatPage() {
  return (
    <main className="grid grid-cols-12 min-h-screen">
      <aside className="col-span-12 md:col-span-3 xl:col-span-2 border-l border-white/10 bg-neutral-900">
        <Sidebar />
      </aside>
      <section className="col-span-12 md:col-span-9 xl:col-span-10 flex flex-col">
        <ChatHeader />
        <div className="flex-1 overflow-y-auto">
          <MessageList />
        </div>
        <MessageInput />
      </section>
    </main>
  )
}
