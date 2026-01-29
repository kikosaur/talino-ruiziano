-- RLS Policies for Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 1. Users can view their own profile
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- 2. Teachers can view ALL profiles
DROP POLICY IF EXISTS "Teachers can view all profiles" ON public.profiles;
CREATE POLICY "Teachers can view all profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = auth.uid()
        AND role = 'teacher'
    )
);

-- RLS Policies for User Roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. Users can view their own role (Already done but good to reinforce)
DROP POLICY IF EXISTS "Users can view their own role" ON public.user_roles;
CREATE POLICY "Users can view their own role"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- 4. Teachers can view ALL roles (Needed to find all students)
DROP POLICY IF EXISTS "Teachers can view all roles" ON public.user_roles;
CREATE POLICY "Teachers can view all roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles ur
        WHERE ur.user_id = auth.uid()
        AND ur.role = 'teacher'
    )
);
