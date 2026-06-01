import { Sidebar } from "./sidebar";
import { ChatContainer } from "@/components/chat/chat-container";

export function AppShell() {
  return (
    <div className="h-screen flex overflow-hidden bg-background">
      <Sidebar />

      <main className="flex-1 overflow-hidden">
        <ChatContainer />
      </main>
    </div>
  );
}
