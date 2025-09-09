'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Send, Loader2, Copy, Download, Eye } from 'lucide-react';
import { useSessionStore } from '@/store/sessionStore';
import { useAuthStore } from '@/store/authStore';
import { apiClient } from '@/lib/api';
import ComponentRenderer from '@/components/ComponentRenderer';
import CodeEditor from '@/components/CodeEditor';
import PropertyPanel from '@/components/PropertyPanel';
// Removed code highlighting in chat bubbles to avoid showing code in chat

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  metadata?: {
    jsxCode?: string;
    cssCode?: string;
  };
}

interface GeneratedComponent {
  jsxCode: string;
  cssCode: string;
}

interface SelectedElement {
  type: string;
  props: Record<string, any>;
  className: string;
  text: string;
  elementId: string;
}

export default function ChatPage() {
  const { id } = useParams();
  const router = useRouter();
  const { sessions, updateSession } = useSessionStore();
  const { user } = useAuthStore();
  const [session, setSession] = useState<any>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentComponent, setCurrentComponent] = useState<GeneratedComponent | null>(null);
  const [selectedElement, setSelectedElement] = useState<SelectedElement | null>(null);
  const [showPropertyPanel, setShowPropertyPanel] = useState(false);

  useEffect(() => {
    const currentSession = sessions.find(s => s.id === id);
    if (currentSession) {
      setSession(currentSession);
      setMessages(currentSession.chatHistory || []);
      if (currentSession.currentComponent) {
        setCurrentComponent({
          jsxCode: currentSession.currentComponent.jsxCode || '',
          cssCode: currentSession.currentComponent.cssCode || '',
        });
      }
    }
  }, [id, sessions]);

  // Auto-save when messages or component changes
  useEffect(() => {
    if (session && (messages.length > 0 || currentComponent)) {
      // Debounce the auto-save to prevent too many requests
      const timeoutId = setTimeout(() => {
        updateSession(id as string, {
          currentComponent: currentComponent ? {
            ...session.currentComponent,
            jsxCode: currentComponent.jsxCode,
            cssCode: currentComponent.cssCode,
            version: (session.currentComponent?.version || 0) + 1,
          } : session.currentComponent,
          chatHistory: messages,
        });
      }, 1000); // Wait 1 second before saving

      return () => clearTimeout(timeoutId);
    }
  }, [messages, currentComponent, session, id]);

  // Removed all auto-scroll behavior; scrolling is fully manual now

  const handleElementClick = (element: SelectedElement) => {
    setSelectedElement(element);
    setShowPropertyPanel(true);
  };

  const handlePropertyChange = (property: string, value: string) => {
    if (!selectedElement || !currentComponent) return;

    // Update the component's JSX code with the new property
    const updatedJsxCode = updateComponentProperty(currentComponent.jsxCode, selectedElement, property, value);

    const updatedComponent = {
      ...currentComponent,
      jsxCode: updatedJsxCode,
    };

    setCurrentComponent(updatedComponent);

    // Auto-save will handle the session update
  };

  const updateComponentProperty = (jsxCode: string, element: SelectedElement, property: string, value: string): string => {
    // Enhanced property replacement logic
    let updatedCode = jsxCode;
    
    // Handle different property types with more sophisticated parsing
    switch (property) {
      case 'backgroundColor':
        // Replace background color classes more precisely
        updatedCode = updatedCode.replace(/bg-\w+(-\d+)?/g, value);
        break;
        
      case 'textColor':
        // Replace text color classes more precisely
        updatedCode = updatedCode.replace(/text-\w+(-\d+)?/g, value);
        break;
        
      case 'padding':
        // Replace padding classes (p-2, p-4, etc.)
        updatedCode = updatedCode.replace(/p-\d+/g, value);
        break;
        
      case 'borderRadius':
        // Replace border radius classes (rounded, rounded-md, etc.)
        updatedCode = updatedCode.replace(/rounded(-\w+)?/g, value);
        break;
        
      case 'text':
        // Replace text content more precisely
        if (element.type === 'button') {
          // Find button text and replace it
          updatedCode = updatedCode.replace(/(<button[^>]*>)([^<]*)(<\/button>)/g, `$1${value}$3`);
        } else if (element.type === 'div') {
          // Find div text and replace it
          updatedCode = updatedCode.replace(/(<div[^>]*>)([^<]*)(<\/div>)/g, `$1${value}$3`);
        }
        break;
        
      case 'fontSize':
        // Replace font size classes
        updatedCode = updatedCode.replace(/text-\w+/g, value);
        break;
        
      case 'fontWeight':
        // Replace font weight classes
        updatedCode = updatedCode.replace(/font-\w+/g, value);
        break;
        
      case 'customClasses':
        // Add custom classes to existing className
        const classNameMatch = updatedCode.match(/className="([^"]+)"/);
        if (classNameMatch) {
          const currentClasses = classNameMatch[1];
          const newClasses = `${currentClasses} ${value}`.trim();
          updatedCode = updatedCode.replace(/className="[^"]+"/, `className="${newClasses}"`);
        }
        break;
    }

    return updatedCode;
  };

  const handleSendMessage = async () => {
    console.log('handleSendMessage called!'); // Basic log
    if (!inputMessage.trim() || isLoading) {
      console.log('Early return - input empty or loading'); // Basic log
      return;
    }

    console.log('Creating user message...'); // Basic log
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString(),
    };

    console.log('Setting messages...'); // Basic log
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Regular component generation
      console.log('About to make AI request...'); // Basic log
      console.log('Sending AI request with message:', inputMessage);
      console.log('Session ID:', id);
      
      const response: any = await apiClient.post('/api/ai/chat', {
        message: inputMessage,
        sessionId: id,
      });

      console.log('AI response received:', response);
      
      // The response is already the data, not wrapped in response.data
      const aiResponse = response;
      
      console.log('AI Response:', aiResponse);
      console.log('AI Response message:', aiResponse.message);
      console.log('AI Response jsxCode:', aiResponse.jsxCode);
      console.log('AI Response cssCode:', aiResponse.cssCode);
      
      // Create assistant message to show in chat
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse.message || 'Component generated successfully!',
        timestamp: new Date().toISOString(),
        metadata: {
          jsxCode: aiResponse.jsxCode,
          cssCode: aiResponse.cssCode || '',
        },
      };

      console.log('Assistant message created:', assistantMessage);
      setMessages(prev => [...prev, assistantMessage]);

      // Update component if JSX code is available
      if (aiResponse.jsxCode) {
        const newComponent: GeneratedComponent = {
          jsxCode: aiResponse.jsxCode,
          cssCode: aiResponse.cssCode || '',
        };
        console.log('Setting new component:', newComponent);
        setCurrentComponent(newComponent);

        // Update session with new component and chat history
        await updateSession(id as string, {
          currentComponent: {
            ...session.currentComponent,
            jsxCode: aiResponse.jsxCode,
            cssCode: aiResponse.cssCode || '',
            metadata: {
              name: 'Generated Component',
              description: inputMessage,
              tags: ['generated'],
            },
            version: (session.currentComponent?.version || 0) + 1,
          },
          chatHistory: [...messages, userMessage, assistantMessage],
        });
      } else {
        // Even if no component generated, save the chat history
        await updateSession(id as string, {
          chatHistory: [...messages, userMessage, assistantMessage],
        });
      }

    } catch (error: any) {
      console.error('Failed to send message:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        stack: error.stack
      });
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Error: ${error.response?.data?.message || error.message || 'Unknown error occurred'}`,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const downloadComponent = async () => {
    if (!currentComponent) return;

    try {
      // Import JSZip dynamically to avoid SSR issues
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();

      // Add JSX file
      zip.file('Component.tsx', currentComponent.jsxCode);
      
      // Add CSS file if it exists
      if (currentComponent.cssCode) {
        zip.file('Component.css', currentComponent.cssCode);
      }

      // Add package.json for React project
      const packageJson = {
        name: "generated-component",
        version: "1.0.0",
        dependencies: {
          "react": "^18.2.0",
          "react-dom": "^18.2.0"
        }
      };
      zip.file('package.json', JSON.stringify(packageJson, null, 2));

      // Generate and download ZIP
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'component.zip';
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to create ZIP:', error);
      // Fallback to simple download
      const content = `// Component.tsx
${currentComponent.jsxCode}

// Component.css
${currentComponent.cssCode}`;

      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'component.txt';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Chat Interface */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-xl font-semibold">{session.name}</h1>
              <p className="text-sm text-muted-foreground">AI Chat Interface</p>
            </div>
          </div>
          {currentComponent && (
            <div className="flex items-center space-x-2">
              <button
                onClick={downloadComponent}
                className="flex items-center gap-2 px-3 py-2 text-sm border rounded-md hover:bg-gray-50 transition-colors"
              >
                <Download className="h-4 w-4" />
                Download
              </button>
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                {/* Intentionally hiding code blocks in chat bubbles */}
                <p className="text-xs opacity-70 mt-2">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Generating component...</span>
                </div>
              </div>
            </div>
          )}
          {/* Manual scrolling: sentinel removed */}
        </div>

        {/* Input */}
        <div className="border-t p-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={
                selectedElement 
                  ? `Modify the selected ${selectedElement.type} (e.g., "make this button blue with 24px padding")`
                  : "Describe the component you want to generate..."
              }
              className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Component Preview */}
      {currentComponent && (
        <div className="w-1/2 border-l">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Component Preview</h2>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Click elements to edit their properties</p>
              {selectedElement && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-blue-600 font-medium">
                    Element selected: {selectedElement.type}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="p-4">
            {/* Live Component Preview */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Live Preview:</h3>
              <div className="border rounded-lg p-6 bg-white min-h-[200px] flex items-center justify-center">
                <ComponentRenderer 
                  component={currentComponent}
                  onElementClick={handleElementClick}
                  selectedElementId={selectedElement?.elementId}
                />
              </div>
            </div>
            
            {/* Code Editor */}
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Code:</h3>
              <CodeEditor
                jsxCode={currentComponent.jsxCode}
                cssCode={currentComponent.cssCode}
                onCopy={(code) => {
                  navigator.clipboard.writeText(code);
                }}
                onDownload={downloadComponent}
              />
            </div>
          </div>
        </div>
      )}

      {/* Property Panel */}
      <PropertyPanel
        selectedElement={selectedElement}
        onPropertyChange={handlePropertyChange}
        onClose={() => {
          setShowPropertyPanel(false);
          setSelectedElement(null);
        }}
        isVisible={showPropertyPanel}
      />
    </div>
  );
} 