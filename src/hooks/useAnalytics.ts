import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useAnalytics = () => {
    const { user } = useAuth();

    const logEvent = useCallback(async (action: string, details: Record<string, any> = {}) => {
        if (!user) return;

        try {
            await supabase.from('usage_logs').insert({
                user_id: user.id,
                action,
                details,
            });
        } catch (error) {
            console.error('Error logging event:', error);
            // Fail silently so we don't disrupt the user experience
        }
    }, [user]);

    return { logEvent };
};
