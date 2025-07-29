export interface Component {
  id: string;
  sessionId: string;
  jsxCode: string;
  cssCode: string;
  metadata: {
    name: string;
    description?: string;
    tags: string[];
  };
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  id: string;
  userId: string;
  name: string;
  description?: string;
  currentComponent: Component;
  chatHistory: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  sessionId?: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  metadata?: {
    elementId?: string;
    imageUrl?: string;
    jsxCode?: string;
    cssCode?: string;
  };
}

export interface CreateSessionRequest {
  name: string;
  description?: string;
}

export interface UpdateSessionRequest {
  name?: string;
  description?: string;
  currentComponent?: Partial<Component>;
  chatHistory?: ChatMessage[];
} 