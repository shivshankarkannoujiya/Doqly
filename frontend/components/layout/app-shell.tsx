import { Sidebar } from "./sidebar";
import { ChatContainer } from "@/components/chat/chat-container";

export function AppShell() {
  return (
    <main className="h-screen flex overflow-hidden">
      <Sidebar />

      <div className="flex-1">
        <ChatContainer />
      </div>
    </main>
  );
}
