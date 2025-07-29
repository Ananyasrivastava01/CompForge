'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Clock, Code, Trash2, Edit3, Eye } from 'lucide-react';
import { useSessionStore } from '@/store/sessionStore';
import { formatDate } from '@/lib/utils';

export default function DashboardPage() {
  const { sessions, loadSessions, deleteSession, isLoading } = useSessionStore();
  const router = useRouter();
  const [deletingSession, setDeletingSession] = useState<string | null>(null);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const handleDeleteSession = async (sessionId: string) => {
    if (!sessionId) {
      console.error('Session ID is undefined');
      return;
    }
    
    if (confirm('Are you sure you want to delete this session?')) {
      setDeletingSession(sessionId);
      try {
        await deleteSession(sessionId);
      } catch (error) {
        console.error('Failed to delete session:', error);
      } finally {
        setDeletingSession(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Your Sessions</h1>
          <p className="text-muted-foreground mt-1">
            Manage your component generation sessions
          </p>
        </div>
        <Link
          href="/dashboard/new"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Session
        </Link>
      </div>

      {/* Sessions Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="border rounded-lg p-6 animate-pulse">
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-3 bg-muted rounded mb-4"></div>
              <div className="h-3 bg-muted rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : !sessions || sessions.length === 0 ? (
        <div className="text-center py-12">
          <Code className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No sessions yet</h3>
          <p className="text-muted-foreground mb-6">
            Create your first session to start generating components
          </p>
          <Link
            href="/dashboard/new"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md font-medium transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create First Session
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions?.map((session) => {
            console.log('Session data:', session); // Debug log
            return (
            <div
              key={session.id}
              className="border rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{session.name}</h3>
                  {session.description && (
                    <p className="text-sm text-muted-foreground mb-2">
                      {session.description}
                    </p>
                  )}
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatDate(session.updatedAt)}
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => router.push(`/dashboard/${session.id}`)}
                    className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                    title="Edit session"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => router.push(`/dashboard/${session.id}`)}
                    className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                    title="View session"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteSession(session.id)}
                    disabled={deletingSession === session.id}
                    className="p-1 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
                    title="Delete session"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {session.currentComponent && (
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {session.currentComponent.metadata.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      v{session.currentComponent.version}
                    </span>
                  </div>
                </div>
              )}

              <div className="mt-4 space-y-2">
                <button
                  onClick={() => router.push(`/dashboard/${session.id}/chat`)}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Chat with AI
                </button>
                <button
                  onClick={() => router.push(`/dashboard/${session.id}`)}
                  className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          );
          })}
        </div>
      )}
    </div>
  );
} 