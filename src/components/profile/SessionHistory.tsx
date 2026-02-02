import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { Clock, History, Loader2 } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface SessionLog {
    id: string;
    session_start: string;
    session_end: string | null;
    duration_seconds: number | null;
}

export function SessionHistory() {
    const { user } = useAuth();
    const [sessions, setSessions] = useState<SessionLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchSessions = async () => {
            setIsLoading(true);
            try {
                const { data, error } = await supabase
                    .from("session_logs")
                    .select("id, session_start, session_end, duration_seconds")
                    .eq("user_id", user.id)
                    .order("session_start", { ascending: false })
                    .limit(10);

                if (error) throw error;
                setSessions(data || []);
            } catch (error) {
                console.error("Error fetching session history:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSessions();
    }, [user]);

    const formatDuration = (seconds: number | null) => {
        if (!seconds) return "-";
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        if (hours > 0) return `${hours}h ${minutes}m`;
        return `${minutes}m`;
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <History className="w-5 h-5" />
                    Login History
                </CardTitle>
                <CardDescription>
                    Your recent active sessions on StudySpark.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                    </div>
                ) : sessions.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No session history found.</p>
                ) : (
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Time</TableHead>
                                    <TableHead>Duration</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sessions.map((session) => (
                                    <TableRow key={session.id}>
                                        <TableCell className="font-medium">
                                            {format(new Date(session.session_start), "MMM d, yyyy")}
                                        </TableCell>
                                        <TableCell>
                                            {format(new Date(session.session_start), "h:mm a")}
                                        </TableCell>
                                        <TableCell className="flex items-center gap-2">
                                            <Clock className="w-3 h-3 text-muted-foreground" />
                                            {formatDuration(session.duration_seconds)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
