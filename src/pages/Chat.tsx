import { ChatInterface } from "@/components/chat/ChatInterface";
import { SEOHead } from "@/components/SEOHead";

const Chat = () => {
  return (
    <>
      <SEOHead
        title="Chat with Elloria"
        description="Have a conversation with Elloria, your personal AI assistant"
      />
      <main className="flex-grow">
        <ChatInterface />
      </main>
    </>
  );
};

export default Chat;