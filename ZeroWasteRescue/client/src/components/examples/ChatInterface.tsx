import { useState } from "react";
import { Button } from "@/components/ui/button";
import ChatInterface from "../ChatInterface";

export default function ChatInterfaceExample() {
  const [isChatOpen, setIsChatOpen] = useState(true);

  return (
    <div className="p-4 min-h-screen bg-background">
      <Button onClick={() => setIsChatOpen(true)} data-testid="button-open-chat">
        Open Chat
      </Button>
      
      <ChatInterface
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        providerName="Grand Plaza Hotel"
        ngoName="Community Food Bank"
        userType="ngo"
        listingTitle="Fresh Vegetarian Meals"
      />
    </div>
  );
}