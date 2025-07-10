import { useState, useEffect } from 'react';
import { AIDatabaseService, ChatSession, ChatMessage } from '../services/aiDatabase';

export const useAIChat = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load chat sessions on mount
  useEffect(() => {
    loadSessions();
  }, []);

  // Load messages when session changes
  useEffect(() => {
    if (currentSession) {
      loadMessages(currentSession.id);
    }
  }, [currentSession]);

  const loadSessions = async () => {
    try {
      const sessionData = await AIDatabaseService.getChatSessions();
      setSessions(sessionData);
      
      // Auto-select first session or create new one
      if (sessionData.length > 0) {
        setCurrentSession(sessionData[0]);
      } else {
        await createNewSession();
      }
    } catch (err) {
      setError('Failed to load chat sessions');
      console.error(err);
    }
  };

  const loadMessages = async (sessionId: string) => {
    try {
      const messageData = await AIDatabaseService.getChatMessages(sessionId);
      setMessages(messageData);
    } catch (err) {
      setError('Failed to load messages');
      console.error(err);
    }
  };

  const createNewSession = async (title?: string) => {
    try {
      const newSession = await AIDatabaseService.createChatSession(title);
      if (newSession) {
        setSessions(prev => [newSession, ...prev]);
        setCurrentSession(newSession);
        setMessages([]);
      }
    } catch (err) {
      setError('Failed to create new session');
      console.error(err);
    }
  };

  const deleteSession = async (sessionId: string) => {
    try {
      const success = await AIDatabaseService.deleteChatSession(sessionId);
      if (success) {
        setSessions(prev => prev.filter(s => s.id !== sessionId));
        
        // If deleted session was current, switch to another or create new
        if (currentSession?.id === sessionId) {
          const remainingSessions = sessions.filter(s => s.id !== sessionId);
          if (remainingSessions.length > 0) {
            setCurrentSession(remainingSessions[0]);
          } else {
            await createNewSession();
          }
        }
      }
    } catch (err) {
      setError('Failed to delete session');
      console.error(err);
    }
  };

  const sendMessage = async (content: string) => {
    if (!currentSession || !content.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // Add user message
      const userMessage = await AIDatabaseService.addMessage(
        currentSession.id,
        content,
        'user'
      );

      if (userMessage) {
        setMessages(prev => [...prev, userMessage]);
      }

      // Get AI response
      const aiResponse = await AIDatabaseService.processAIQuery(
        currentSession.id,
        content
      );

      // Add AI message
      const aiMessage = await AIDatabaseService.addMessage(
        currentSession.id,
        aiResponse,
        'assistant'
      );

      if (aiMessage) {
        setMessages(prev => [...prev, aiMessage]);
      }

      // Update session title if it's the first message
      if (messages.length === 0) {
        const title = content.length > 50 ? content.substring(0, 50) + '...' : content;
        setSessions(prev => 
          prev.map(s => 
            s.id === currentSession.id 
              ? { ...s, title }
              : s
          )
        );
      }

    } catch (err) {
      setError('Failed to send message');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const switchSession = (session: ChatSession) => {
    setCurrentSession(session);
  };

  return {
    sessions,
    currentSession,
    messages,
    loading,
    error,
    sendMessage,
    createNewSession,
    deleteSession,
    switchSession,
    loadSessions,
  };
};