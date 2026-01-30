import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Clock, Calendar, TrendingUp } from 'lucide-react';

export function UsageStatsCard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalTime: 0,
        todayTime: 0,
        sessionCount: 0,
        averageSession: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchStats = async () => {
            setLoading(true);
            try {
                // Get total stats from profile
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('total_time_spent_seconds, session_count')
                    .eq('user_id', user.id)
                    .single();

                // Get today's sessions
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const { data: todaySessions } = await supabase
                    .from('session_logs')
                    .select('duration_seconds')
                    .eq('user_id', user.id)
                    .gte('session_start', today.toISOString());

                const todayTotal = todaySessions?.reduce(
                    (sum, s) => sum + (s.duration_seconds || 0),
                    0
                ) || 0;

                setStats({
                    totalTime: profile?.total_time_spent_seconds || 0,
                    todayTime: todayTotal,
                    sessionCount: profile?.session_count || 0,
                    averageSession: profile?.session_count
                        ? Math.floor((profile?.total_time_spent_seconds || 0) / profile.session_count)
                        : 0,
                });
            } catch (error) {
                console.error('Failed to fetch usage stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();

        // Refresh stats every minute
        const interval = setInterval(fetchStats, 60000);
        return () => clearInterval(interval);
    }, [user]);

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);

        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        if (minutes > 0) {
            return `${minutes}m`;
        }
        return '< 1m';
    };

    if (loading) {
        return (
            <div className="card-elevated p-6 animate-pulse">
                <div className="h-6 bg-muted rounded mb-4 w-32"></div>
                <div className="space-y-4">
                    <div className="h-12 bg-muted rounded"></div>
                    <div className="h-12 bg-muted rounded"></div>
                    <div className="h-12 bg-muted rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="card-elevated p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
                Your Usage Stats
            </h3>

            <div className="space-y-4">
                {/* Total Time */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                        <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                        <p className="text-xs text-muted-foreground">Total Time</p>
                        <p className="text-xl font-bold text-foreground">
                            {formatTime(stats.totalTime)}
                        </p>
                    </div>
                </div>

                {/* Today's Time */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-accent" />
                    </div>
                    <div className="flex-1">
                        <p className="text-xs text-muted-foreground">Today</p>
                        <p className="text-xl font-bold text-foreground">
                            {formatTime(stats.todayTime)}
                        </p>
                    </div>
                </div>

                {/* Average Session */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                        <p className="text-xs text-muted-foreground">Avg Session</p>
                        <p className="text-xl font-bold text-foreground">
                            {formatTime(stats.averageSession)}
                        </p>
                    </div>
                </div>

                {/* Session Count */}
                <div className="pt-3 border-t border-border">
                    <p className="text-sm text-muted-foreground text-center">
                        {stats.sessionCount} session{stats.sessionCount !== 1 ? 's' : ''} total
                    </p>
                </div>
            </div>
        </div>
    );
}
