import React, { useState } from 'react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hello! I'm your ethical AI learning assistant. I'm here to help you understand concepts, structure your thinking, and guide your learning journey.

**What I can help with:**
- Explaining concepts and reasoning
- Study guidance and learning strategies
- Breaking down complex topics
- Suggesting learning approaches

**What I won't do:**
- Complete assignments for you
- Answer exam questions directly
- Provide medical or financial advice
- Do your homework

How can I help you learn today?`,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // TODO: Call AI API
      // For now, simulate AI response
      setTimeout(() => {
        const aiResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: generateMockResponse(inputMessage),
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiResponse]);
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
    }
  };

  const generateMockResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    // Check for forbidden patterns
    if (lowerInput.includes('complete') && lowerInput.includes('assignment')) {
      return `I can't complete assignments for you, as that would prevent you from learning. Instead, I can help you:

- Understand the key concepts involved
- Break down the problem into smaller parts
- Suggest a structured approach
- Explain relevant theories or methods

What specific concept or part of the assignment would you like me to explain?`;
    }

    if (lowerInput.includes('answer') && (lowerInput.includes('exam') || lowerInput.includes('test'))) {
      return `I can't provide direct answers to exam or test questions. However, I can help you prepare by:

- Explaining the underlying concepts
- Walking through similar example problems
- Helping you understand the methodology
- Suggesting study strategies

What topic are you studying for? I'd be happy to explain the concepts!`;
    }

    if (lowerInput.includes('medical') || lowerInput.includes('diagnose') || lowerInput.includes('health advice')) {
      return `I can't provide medical advice or diagnoses. For health concerns, please consult with qualified healthcare professionals.

If you're looking for general wellness information for students (like stress management techniques or healthy study habits), I'd be happy to share some educational resources!`;
    }

    // Provide helpful educational responses
    if (lowerInput.includes('study') || lowerInput.includes('learn')) {
      return `Great question about learning! Here are some evidence-based study strategies:

**Active Learning Techniques:**
- Summarize concepts in your own words
- Create concept maps or diagrams
- Teach the material to someone else
- Practice retrieval (testing yourself)

**Effective Study Habits:**
- Use spaced repetition for memorization
- Take regular breaks (Pomodoro technique)
- Study in different environments
- Connect new information to what you already know

What specific subject or topic are you working on? I can provide more targeted guidance!`;
    }

    // Default helpful response
    return `I'd be happy to help you understand this topic better! To provide the most useful guidance, could you tell me:

- What specific concept you're trying to understand?
- What level you're studying at?
- What part is most confusing?

Remember, my goal is to help you learn and think through problems, not to do the work for you. Let's explore this together!`;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div>
      <div className="card">
        <h1>AI Learning Assistant</h1>
        <div style={{ 
          background: '#fff3cd', 
          padding: '1rem', 
          borderRadius: '4px', 
          marginTop: '1rem' 
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#856404' }}>Ethical AI Boundaries</h3>
          <p style={{ margin: 0, color: '#856404' }}>
            This AI assistant is designed to help you learn, not to do your work for you. 
            It encourages independent thinking and ethical academic practices.
          </p>
        </div>
      </div>

      <div className="card" style={{ height: '500px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ 
          flex: 1, 
          overflowY: 'auto', 
          padding: '1rem', 
          background: '#f8f9fa', 
          borderRadius: '4px',
          marginBottom: '1rem'
        }}>
          {messages.map(message => (
            <div 
              key={message.id}
              style={{
                marginBottom: '1rem',
                padding: '1rem',
                borderRadius: '8px',
                background: message.role === 'user' ? '#4a90e2' : '#fff',
                color: message.role === 'user' ? 'white' : '#333',
                marginLeft: message.role === 'user' ? '20%' : '0',
                marginRight: message.role === 'user' ? '0' : '20%'
              }}
            >
              <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem', opacity: 0.8 }}>
                {message.role === 'user' ? 'You' : 'AI Assistant'} • {message.timestamp.toLocaleTimeString()}
              </div>
              <div style={{ whiteSpace: 'pre-wrap' }}>
                {message.content}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div style={{
              padding: '1rem',
              borderRadius: '8px',
              background: '#fff',
              marginRight: '20%',
              fontStyle: 'italic',
              color: '#6c757d'
            }}>
              AI is thinking...
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <textarea
            className="form-textarea"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me to explain a concept, help with study strategies, or guide your learning..."
            style={{ flex: 1, minHeight: '60px', resize: 'none' }}
            disabled={isLoading}
          />
          <button 
            className="btn btn-primary"
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isLoading}
            style={{ alignSelf: 'flex-end' }}
          >
            Send
          </button>
        </div>
      </div>

      <div className="card">
        <h2>AI Usage Guidelines</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div>
            <h3 style={{ color: '#28a745' }}>✅ Encouraged Uses</h3>
            <ul>
              <li>Explain difficult concepts</li>
              <li>Suggest study strategies</li>
              <li>Help structure your thinking</li>
              <li>Provide learning resources</li>
              <li>Guide problem-solving approaches</li>
            </ul>
          </div>
          <div>
            <h3 style={{ color: '#dc3545' }}>❌ Not Allowed</h3>
            <ul>
              <li>Complete assignments</li>
              <li>Answer exam questions</li>
              <li>Write essays or reports</li>
              <li>Provide medical advice</li>
              <li>Give financial recommendations</li>
            </ul>
          </div>
        </div>
        <div style={{ 
          marginTop: '1rem', 
          padding: '1rem', 
          background: '#e7f3ff', 
          borderRadius: '4px' 
        }}>
          <p style={{ margin: 0 }}>
            <strong>Remember:</strong> The goal is to enhance your learning, not replace it. 
            Use this tool to understand concepts better and develop your own thinking skills.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;