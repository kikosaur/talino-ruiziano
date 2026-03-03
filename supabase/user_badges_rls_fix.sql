-- Enable RLS on user_badges if it isn't already
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own badges
DROP POLICY IF EXISTS "Users can read own badges" ON public.user_badges;
CREATE POLICY "Users can read own badges" ON public.user_badges
    FOR SELECT USING (auth.uid() = user_id);

-- Restrict INSERT access to teachers/admins ONLY, close vulnerability!
DROP POLICY IF EXISTS "Users can insert own badges" ON public.user_badges;
DROP POLICY IF EXISTS "Teachers can insert user_badges" ON public.user_badges;
CREATE POLICY "Teachers can insert user_badges" ON public.user_badges
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_roles.user_id = auth.uid() 
            AND user_roles.role = 'teacher'
        )
    );

-- Optionally, give teachers full access to user_badges if they need to manually award/revoke
DROP POLICY IF EXISTS "Teachers can manage user_badges" ON public.user_badges;
CREATE POLICY "Teachers can manage user_badges" ON public.user_badges
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_roles.user_id = auth.uid() 
            AND user_roles.role = 'teacher'
        )
    );

-- CREATE SECURE POSTGRES TRIGGER FOR AUTOMATIC POINTS & BADGES ON SUBMISSION
CREATE OR REPLACE FUNCTION public.handle_new_submission()
RETURNS TRIGGER AS $$
DECLARE
    v_total_points integer;
    v_streak_days integer;
    v_deadline timestamp;
    v_days_to_deadline integer;
    v_is_weekend boolean;
    v_badge record;
BEGIN
    -- Update profile points securely on the backend
    UPDATE public.profiles
    SET total_points = total_points + NEW.points_awarded
    WHERE user_id = NEW.user_id
    RETURNING total_points, streak_days INTO v_total_points, v_streak_days;

    -- Calculate times
    v_is_weekend := EXTRACT(DOW FROM NOW()) IN (0, 6);
    
    SELECT deadline INTO v_deadline
    FROM public.ilt_deadlines
    WHERE name = NEW.ilt_name;
    
    IF FOUND THEN
        v_days_to_deadline := EXTRACT(DAY FROM (v_deadline - NOW()));
    ELSE
        v_days_to_deadline := NULL;
    END IF;

    -- Evaluate and award badges automatically via backend logic
    FOR v_badge IN SELECT * FROM public.badges LOOP
        -- Skip if already earned
        IF NOT EXISTS (SELECT 1 FROM public.user_badges WHERE user_id = NEW.user_id AND badge_id = v_badge.id) THEN
            
            -- Evaluate logic
            IF (v_badge.required_points IS NOT NULL AND v_total_points >= v_badge.required_points) OR
               (v_badge.name = 'Early Bird' AND v_days_to_deadline IS NOT NULL AND v_days_to_deadline >= 3) OR
               (v_badge.name = 'Weekend Warrior' AND v_is_weekend) OR
               (v_badge.name = 'On Fire' AND v_streak_days >= 7) OR
               (v_badge.name = 'Scholar' AND v_total_points >= 1000) THEN
                
                -- Award badge safely bypassing RLS via SECURITY DEFINER
                INSERT INTO public.user_badges (user_id, badge_id)
                VALUES (NEW.user_id, v_badge.id);
            END IF;
        END IF;
    END LOOP;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_new_submission ON public.submissions;
CREATE TRIGGER on_new_submission
    AFTER INSERT ON public.submissions
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_submission();
