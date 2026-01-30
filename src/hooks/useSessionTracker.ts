import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook to track user session time
 * - Automatically starts a session when component mounts
 * - Tracks active time (not idle time)
 * - Ends session on unmount, tab close, or after idle timeout
 * - Handles page visibility changes
 */
export const useSessionTracker = () => {
    const { user } = useAuth();
    const sessionIdRef = useRef<string | null>(null);
    const startTimeRef = useRef<number>(Date.now());
    const lastActivityRef = useRef<number>(Date.now());
    const isActiveRef = useRef<boolean>(true);

    const IDLE_TIMEOUT = 5 * 60 * 1000; // 5 minutes of inactivity
    const CHECK_INTERVAL = 10 * 1000; // Check for idle every 10 seconds

    // Start new session
    const startSession = async () => {
        if (!user || sessionIdRef.current) return;

        try {
            const { data, error } = await supabase
                .from('session_logs')
                .insert({
                    user_id: user.id,
                    session_start: new Date().toISOString(),
                })
                .select()
                .single();

            if (data && !error) {
                sessionIdRef.current = data.id;
                startTimeRef.current = Date.now();
                lastActivityRef.current = Date.now();
                isActiveRef.current = true;
            }
        } catch (error) {
            console.error('Failed to start session:', error);
        }
    };

    // End session
    const endSession = async () => {
        if (!sessionIdRef.current || !user) return;

        const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);

        try {
            await supabase
                .from('session_logs')
                .update({
                    session_end: new Date().toISOString(),
                    duration_seconds: duration,
                })
                .eq('id', sessionIdRef.current);

            sessionIdRef.current = null;
            isActiveRef.current = false;
        } catch (error) {
            console.error('Failed to end session:', error);
        }
    };

    // Track user activity
    const trackActivity = () => {
        lastActivityRef.current = Date.now();

        // Restart session if it was ended due to inactivity
        if (!isActiveRef.current && user) {
            isActiveRef.current = true;
            startSession();
        }
    };

    // Check for idle state
    useEffect(() => {
        if (!user) return;

        const checkIdle = setInterval(() => {
            const timeSinceActivity = Date.now() - lastActivityRef.current;

            // If user has been idle for longer than threshold, end session
            if (timeSinceActivity > IDLE_TIMEOUT && isActiveRef.current) {
                endSession();
            }
        }, CHECK_INTERVAL);

        return () => clearInterval(checkIdle);
    }, [user]);

    // Set up activity listeners
    useEffect(() => {
        if (!user) return;

        const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

        events.forEach(event => {
            window.addEventListener(event, trackActivity, { passive: true });
        });

        return () => {
            events.forEach(event => {
                window.removeEventListener(event, trackActivity);
            });
        };
    }, [user]);

    // Handle page visibility changes (tab switching, minimize, etc.)
    useEffect(() => {
        if (!user) return;

        const handleVisibilityChange = () => {
            if (document.hidden) {
                // User switched tabs or minimized window - end session
                endSession();
            } else {
                // User came back - start new session if not already active
                if (!sessionIdRef.current) {
                    startSession();
                }
                trackActivity();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [user]);

    // Handle beforeunload (page close/refresh)
    useEffect(() => {
        if (!user) return;

        const handleBeforeUnload = () => {
            // Simply end the session synchronously
            // The unmount effect will also handle cleanup
            if (sessionIdRef.current) {
                endSession();
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [user]);

    // Start session on mount
    useEffect(() => {
        if (user) {
            startSession();
        }

        // End session on unmount
        return () => {
            if (user) {
                endSession();
            }
        };
    }, [user]);

    return {
        sessionId: sessionIdRef.current,
        isActive: isActiveRef.current
    };
};
