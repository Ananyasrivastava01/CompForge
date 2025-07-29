'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Save, Trash2 } from 'lucide-react';
import { useSessionStore } from '@/store/sessionStore';
import { Session } from '@/types/session';

export default function SessionDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { sessions, updateSession, deleteSession, isLoading, error } = useSessionStore();
  const [session, setSession] = useState<Session | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const currentSession = sessions.find(s => s.id === id);
    if (currentSession) {
      setSession(currentSession);
      setName(currentSession.name);
      setDescription(currentSession.description || '');
    }
  }, [id, sessions]);

  const handleSave = async () => {
    if (!session) return;
    
    console.log('Saving session with ID:', session.id); // Debug log
    console.log('Update data:', { name: name.trim(), description: description.trim() || undefined }); // Debug log
    
    setIsSaving(true);
    try {
      await updateSession(session.id, {
        name: name.trim(),
        description: description.trim() || undefined,
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update session:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!session) return;
    
    if (confirm('Are you sure you want to delete this session? This action cannot be undone.')) {
      try {
        await deleteSession(session.id);
        router.push('/dashboard');
      } catch (error) {
        console.error('Failed to delete session:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Session not found</h2>
        <button
          onClick={() => router.push('/dashboard')}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  // Safety check for session properties
  if (!session.chatHistory) {
    session.chatHistory = [];
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold">
              {isEditing ? 'Edit Session' : session.name}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isEditing ? 'Update session details' : 'Session details and management'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => router.push(`/dashboard/${session.id}/chat`)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Chat with AI
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 border border-red-300 rounded-md text-red-700 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      {/* Session Details */}
      <div className="bg-white border rounded-lg p-6">
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Session Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Session Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <p className="text-gray-900">{session.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Created</label>
                  <p className="text-gray-900">{new Date(session.createdAt).toLocaleDateString()}</p>
                </div>
                {session.description && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <p className="text-gray-900">{session.description}</p>
                  </div>
                )}
              </div>
            </div>

            {session.currentComponent && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Current Component</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">
                    Component: {session.currentComponent.metadata.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Version: {session.currentComponent.version}
                  </p>
                </div>
              </div>
            )}

            <div>
              <h3 className="text-lg font-semibold mb-2">Chat History</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                  {session.chatHistory?.length || 0} messages
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}
    </div>
  );
} 