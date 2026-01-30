-- 1. Create a function to award a badge safely
CREATE OR REPLACE FUNCTION award_badge(target_user_id UUID, badge_name TEXT)
RETURNS VOID AS $$
DECLARE
    target_badge_id UUID;
BEGIN
    -- Get badge ID
    SELECT id INTO target_badge_id FROM badges WHERE name = badge_name;
    
    -- If badge exists and user doesn't have it yet, award it
    IF target_badge_id IS NOT NULL THEN
        IF NOT EXISTS (SELECT 1 FROM user_badges WHERE user_id = target_user_id AND badge_id = target_badge_id) THEN
            INSERT INTO user_badges (user_id, badge_id)
            VALUES (target_user_id, target_badge_id);
        END IF;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Trigger for Profile Updates (Points & Streak)
CREATE OR REPLACE FUNCTION check_profile_badges()
RETURNS TRIGGER AS $$
BEGIN
    -- Check for "Scholar" (1000 Points)
    IF NEW.total_points >= 1000 THEN
        PERFORM award_badge(NEW.user_id, 'Scholar');
    END IF;

    -- Check for "On Fire" (7 Day Streak)
    IF NEW.streak_days >= 7 THEN
        PERFORM award_badge(NEW.user_id, 'On Fire');
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_check_profile_badges ON profiles;
CREATE TRIGGER trigger_check_profile_badges
AFTER UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION check_profile_badges();

-- 3. Trigger for new Submissions (Early Bird)
CREATE OR REPLACE FUNCTION check_submission_badges()
RETURNS TRIGGER AS $$
DECLARE
    deadline_date TIMESTAMPTZ;
BEGIN
    -- Get deadline for the ILT
    SELECT deadline INTO deadline_date 
    FROM ilt_deadlines 
    WHERE name = NEW.ilt_name 
    LIMIT 1;

    -- Check for "Early Bird" (Submitted 3 days early)
    IF deadline_date IS NOT NULL THEN
        IF NEW.submitted_at <= (deadline_date - INTERVAL '3 days') THEN
            PERFORM award_badge(NEW.user_id, 'Early Bird');
        END IF;
    END IF;

    -- Check for "First Steps" (First submission)
    -- We need to check if this is the first submission. Since this is AFTER INSERT, count should be 1.
    IF (SELECT count(*) FROM submissions WHERE user_id = NEW.user_id) = 1 THEN
         PERFORM award_badge(NEW.user_id, 'First Steps'); -- Assuming 'First Steps' badge exists (or created one)
         -- Actually, checking add_more_badges.sql, 'First Steps' wasn't there? 
         -- 'Early Bird', 'Social Butterfly', 'On Fire', 'Scholar', 'Weekend Warrior'.
         -- But 'First Steps' is good to have. If it doesn't exist, award_badge does nothing safely.
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_check_submission_badges ON submissions;
CREATE TRIGGER trigger_check_submission_badges
AFTER INSERT ON submissions
FOR EACH ROW
EXECUTE FUNCTION check_submission_badges();

-- 4. Trigger for Session Logs (Weekend Warrior)
CREATE OR REPLACE FUNCTION check_session_badges()
RETURNS TRIGGER AS $$
DECLARE
    dow INTEGER;
BEGIN
    -- Get Day of Week (0 = Sunday, 6 = Saturday)
    dow := EXTRACT(DOW FROM NEW.session_start);
    
    -- Check for "Weekend Warrior"
    IF dow = 0 OR dow = 6 THEN
        PERFORM award_badge(NEW.user_id, 'Weekend Warrior');
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_check_session_badges ON session_logs;
CREATE TRIGGER trigger_check_session_badges
AFTER INSERT ON session_logs
FOR EACH ROW
EXECUTE FUNCTION check_session_badges();

-- 5. Trigger for Messages (Social Butterfly)
CREATE OR REPLACE FUNCTION check_message_badges()
RETURNS TRIGGER AS $$
DECLARE
    msg_count INTEGER;
BEGIN
    -- Count user messages
    SELECT count(*) INTO msg_count FROM messages WHERE user_id = NEW.user_id;

    -- Check for "Social Butterfly" (e.g., 10 messages)
    IF msg_count >= 10 THEN
        PERFORM award_badge(NEW.user_id, 'Social Butterfly');
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_check_message_badges ON messages;
CREATE TRIGGER trigger_check_message_badges
AFTER INSERT ON messages
FOR EACH ROW
EXECUTE FUNCTION check_message_badges();
