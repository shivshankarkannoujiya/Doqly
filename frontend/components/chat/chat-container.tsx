import { ChatInput } from "./chat-input";
import { MessageList } from "./message-list";

export function ChatContainer() {
  return (
    <div
      className="
      h-full
      flex
      flex-col
    "
    >
      <MessageList />

      <ChatInput />
    </div>
  );
}
