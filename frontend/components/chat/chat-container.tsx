import { ChatInput } from "./chat-input";
import { MessageList } from "./message-list";

export function ChatContainer() {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-hidden">
        <MessageList />
      </div>

      <ChatInput />
    </div>
  );
}
