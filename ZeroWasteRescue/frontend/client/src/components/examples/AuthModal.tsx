import { useState } from "react";
import { Button } from "@/components/ui/button";
import AuthModal from "../AuthModal";

export default function AuthModalExample() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="p-4 min-h-screen bg-background">
      <Button onClick={() => setIsOpen(true)} data-testid="button-open-auth">
        Open Auth Modal
      </Button>
      
      <AuthModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onLogin={(data) => console.log("Login:", data)}
        onRegister={(data) => console.log("Register:", data)}
        initialTab="register"
      />
    </div>
  );
}