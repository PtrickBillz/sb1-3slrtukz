import { supabase } from '../lib/supabase';
import { openai } from './openai';

export interface ChatSession {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  content: string;
  role: 'user' | 'assistant';
  created_at: string;
}

export class AIDatabaseService {
  // Chat Session Management
  static async createChatSession(title: string = 'New Chat'): Promise<ChatSession | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('chat_sessions')
        .insert({ user_id: user.id, title })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating chat session:', error);
      return null;
    }
  }

  static async getChatSessions(): Promise<ChatSession[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching chat sessions:', error);
      return [];
    }
  }

  static async deleteChatSession(sessionId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('chat_sessions')
        .delete()
        .eq('id', sessionId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting chat session:', error);
      return false;
    }
  }

  // Message Management
  static async getChatMessages(sessionId: string): Promise<ChatMessage[]> {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      return [];
    }
  }

  static async addMessage(sessionId: string, content: string, role: 'user' | 'assistant'): Promise<ChatMessage | null> {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({ session_id: sessionId, content, role })
        .select()
        .single();

      if (error) throw error;

      // Update session timestamp
      await supabase
        .from('chat_sessions')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', sessionId);

      return data;
    } catch (error) {
      console.error('Error adding message:', error);
      return null;
    }
  }

  // AI Query Processing
  static async processAIQuery(sessionId: string, query: string): Promise<string> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get user context from database
      const userContext = await this.getUserContext(user.id);
      
      // Get recent conversation history
      const recentMessages = await this.getChatMessages(sessionId);
      const conversationHistory = recentMessages.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Create enhanced prompt with database context
      const systemPrompt = this.createSystemPrompt(userContext);
      
      const messages = [
        { role: 'system' as const, content: systemPrompt },
        ...conversationHistory,
        { role: 'user' as const, content: query }
      ];

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages,
        max_tokens: 1000,
        temperature: 0.7,
      });

      const aiResponse = response.choices[0]?.message?.content || 'Sorry, I could not process your request.';

      // Save the query and response for analytics
      await this.saveAIQuery(user.id, query, aiResponse);

      return aiResponse;
    } catch (error) {
      console.error('Error processing AI query:', error);
      return 'I apologize, but I encountered an error processing your request. Please try again.';
    }
  }

  // User Context Management
  static async getUserContext(userId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('user_data')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      // If no user data exists, create default
      if (!data) {
        const { data: newData, error: insertError } = await supabase
          .from('user_data')
          .insert({ user_id: userId })
          .select()
          .single();
        
        if (insertError) throw insertError;
        return newData;
      }

      return data;
    } catch (error) {
      console.error('Error getting user context:', error);
      return { wallets: [], preferences: {} };
    }
  }

  static async updateUserWallets(wallets: string[]): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('user_data')
        .upsert({ 
          user_id: user.id, 
          wallets,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating user wallets:', error);
      return false;
    }
  }

  // Analytics
  static async saveAIQuery(userId: string, query: string, response: string, queryType: string = 'general'): Promise<void> {
    try {
      await supabase
        .from('ai_queries')
        .insert({
          user_id: userId,
          query,
          response,
          query_type: queryType
        });
    } catch (error) {
      console.error('Error saving AI query:', error);
    }
  }

  static async getQueryAnalytics(): Promise<any[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('ai_queries')
        .select('query_type, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching query analytics:', error);
      return [];
    }
  }

  // System Prompt Creation
  private static createSystemPrompt(userContext: any): string {
    const wallets = userContext.wallets || [];
    const preferences = userContext.preferences || {};

    return `You are AidAgent, an AI assistant specialized in DeFi, Web3, and cryptocurrency analysis. You have access to the user's data and can provide personalized insights.

User Context:
- Connected Wallets: ${wallets.length > 0 ? wallets.join(', ') : 'None'}
- User Preferences: ${JSON.stringify(preferences)}

Your capabilities include:
1. Analyzing wallet addresses and transactions
2. Providing DeFi strategy recommendations
3. Explaining complex Web3 concepts
4. Risk assessment for tokens and protocols
5. Market analysis and trends
6. Security best practices

Guidelines:
- Always prioritize user security and risk management
- Provide actionable, practical advice
- Explain technical concepts in accessible terms
- Reference the user's wallet data when relevant
- Ask clarifying questions when needed
- Never provide financial advice, only educational information

Respond in a helpful, professional manner while being conversational and engaging.`;
  }
}