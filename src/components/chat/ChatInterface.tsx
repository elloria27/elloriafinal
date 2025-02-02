import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar3D } from '../avatar/Avatar3D';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const ChatInterface = () => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Please sign in to chat with Elloria");
        return;
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) throw new Error('Failed to send message');

      const { answer } = await response.json();

      // Store the interaction in Supabase
      await supabase.from('chat_interactions').insert({
        user_id: user.id,
        message: message,
        response: answer,
      });

      setMessage('');
      toast.success("Message sent successfully");
    } catch (error) {
      console.error('Chat error:', error);
      toast.error("Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-4 p-4 max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <Avatar3D />
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask Elloria anything..."
          className="min-h-[100px] resize-none"
          disabled={isLoading}
        />
        <Button 
          type="submit" 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send Message"}
        </Button>
      </form>
    </div>
  );
};