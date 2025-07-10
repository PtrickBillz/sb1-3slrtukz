export interface Database {
  public: {
    Tables: {
      chat_sessions: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      chat_messages: {
        Row: {
          id: string;
          session_id: string;
          content: string;
          role: 'user' | 'assistant';
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          content: string;
          role: 'user' | 'assistant';
          created_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          content?: string;
          role?: 'user' | 'assistant';
          created_at?: string;
        };
      };
      user_data: {
        Row: {
          id: string;
          user_id: string;
          wallets: any[];
          preferences: Record<string, any>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          wallets?: any[];
          preferences?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          wallets?: any[];
          preferences?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
        };
      };
      ai_queries: {
        Row: {
          id: string;
          user_id: string;
          query: string;
          response: string;
          query_type: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          query: string;
          response: string;
          query_type?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          query?: string;
          response?: string;
          query_type?: string;
          created_at?: string;
        };
      };
    };
  };
}