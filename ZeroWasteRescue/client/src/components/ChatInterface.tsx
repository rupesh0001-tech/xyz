import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, X, Loader2 } from "lucide-react";
import { messagesApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  senderId: string;
  receiverId: string;
  listingId: string;
  createdAt: string;
}

interface ChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  listing: {
    id: string;
    title: string;
    provider: {
      id: string;
      name: string;
    };
  };
  otherUser: {
    id: string;
    name: string;
  };
  currentUserId: string;
  userType: "provider" | "ngo";
}

export default function ChatInterface({ 
  isOpen, 
  onClose, 
  listing,
  otherUser,
  currentUserId,
  userType
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Load messages when chat opens
  useEffect(() => {
    if (isOpen && listing?.id) {
      loadMessages();
    }
  }, [isOpen, listing?.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    if (!listing?.id || !otherUser?.id) {
      console.error("Missing listing or user data for loading messages");
      return;
    }

    setLoading(true);
    try {
      const response = await messagesApi.getByListing(listing.id, otherUser.id) as Message[];
      setMessages(response);
    } catch (error: any) {
      console.error("Load messages error:", error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || sending) return;

    // Validate required data before sending
    if (!otherUser?.id || !listing?.id) {
      toast({
        title: "Error",
        description: "Unable to send message - missing chat information",
        variant: "destructive",
      });
      return;
    }

    setSending(true);
    try {
      const messageData = {
        text: newMessage.trim(),
        receiverId: otherUser.id,
        listingId: listing.id
      };

      const newMsg = await messagesApi.send(messageData) as Message;
      setMessages(prev => [...prev, newMsg]);
      setNewMessage("");
    } catch (error: any) {
      console.error("Message send error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  const formatMessageTime = (createdAt: string) => {
    return new Date(createdAt).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl h-[600px] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>{otherUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg" data-testid="text-chat-partner">{otherUser.name}</CardTitle>
              <Badge variant="outline" className="text-xs" data-testid="badge-listing-title">
                {listing.title}
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={onClose} data-testid="button-close-chat">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 p-0">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[400px]">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2">Loading messages...</span>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex justify-center items-center h-full text-muted-foreground">
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
                  data-testid={`message-${message.id}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.senderId === currentUserId
                        ? 'bg-primary text-primary-foreground ml-auto'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">{formatMessageTime(message.createdAt)}</p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1"
                data-testid="input-message"
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={!newMessage.trim() || sending}
                data-testid="button-send"
              >
                {sending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}