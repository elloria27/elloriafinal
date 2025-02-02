import { useState } from "react";
import { Avatar3D } from "@/components/avatar/Avatar3D";
import VoiceInterface from "@/components/chat/VoiceInterface";
import { SEOHead } from "@/components/SEOHead";

const Chat = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  return (
    <>
      <SEOHead
        title="Talk with Elloria"
        description="Have a voice conversation with Elloria, your personal AI assistant"
      />
      <main className="flex-grow">
        <div className="flex flex-col space-y-4 p-4 max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <Avatar3D />
          </div>
          <VoiceInterface onSpeakingChange={setIsSpeaking} />
        </div>
      </main>
    </>
  );
};

export default Chat;