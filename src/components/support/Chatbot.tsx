
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bot, Send, User } from 'lucide-react';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

const initialMessages: Message[] = [
  {
    id: '1',
    text: "Hello! I'm your FlexiQuote assistant. How can I help you today with your insurance quotes or policy questions?",
    sender: 'bot',
    timestamp: new Date(),
  },
];

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot response with common insurance questions
    setTimeout(() => {
      let botResponse = "I'm not sure how to answer that. Could you provide more details about your insurance question?";
      
      const userMessageLower = inputValue.toLowerCase();
      
      if (userMessageLower.includes('quote') || userMessageLower.includes('pricing')) {
        botResponse = "To get a quote, please navigate to the 'New Quote' page from the main menu. You'll need to provide details about the property, coverage requirements, and client information.";
      } else if (userMessageLower.includes('policy') || userMessageLower.includes('coverage')) {
        botResponse = "Our Domestic Fire & Burglary Policies provide comprehensive coverage for residential properties. This includes protection against fire damage, theft, and in some cases, natural disasters.";
      } else if (userMessageLower.includes('claim') || userMessageLower.includes('file a claim')) {
        botResponse = "To file a claim, please have your policy number ready and contact our claims department directly at claims@flexiquote.com or call 1-800-555-1234.";
      } else if (userMessageLower.includes('renewal') || userMessageLower.includes('renew')) {
        botResponse = "Policy renewals are typically processed 30 days before expiration. You'll receive a notification when it's time to renew. You can process renewals through the Quotes section.";
      } else if (userMessageLower.includes('hello') || userMessageLower.includes('hi') || userMessageLower.includes('hey')) {
        botResponse = "Hello! How can I assist you with your insurance needs today?";
      } else if (userMessageLower.includes('thank')) {
        botResponse = "You're welcome! Is there anything else I can help you with?";
      } else if (userMessageLower.includes('speak') || userMessageLower.includes('human') || userMessageLower.includes('agent')) {
        botResponse = "If you'd like to speak with a human agent, please submit a ticket through our support system, and someone will get back to you shortly.";
      }

      const botMessage: Message = {
        id: Date.now().toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };

      setIsTyping(false);
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto mb-4 pr-2">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  message.sender === 'user' 
                    ? 'bg-insurance-yellow text-black ml-2' 
                    : 'bg-insurance-gray-medium text-black mr-2'
                }`}>
                  {message.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={`p-3 rounded-lg ${
                  message.sender === 'user' 
                    ? 'bg-insurance-yellow text-black' 
                    : 'bg-insurance-gray-light text-black-light'
                }`}>
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex flex-row">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-insurance-gray-medium text-black mr-2">
                  <Bot size={16} />
                </div>
                <div className="p-3 rounded-lg bg-insurance-gray-light">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="flex gap-2 mt-auto">
        <Input
          placeholder="Type your message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-grow"
        />
        <Button 
          onClick={handleSendMessage} 
          disabled={isTyping || inputValue.trim() === ''}
          className="bg-insurance-yellow hover:bg-insurance-yellow-dark text-black"
        >
          <Send size={18} />
        </Button>
      </div>
    </div>
  );
};

export default Chatbot;
