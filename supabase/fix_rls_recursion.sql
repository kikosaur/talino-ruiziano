-- Function to check if a user is a teacher (Security Definer to bypass RLS)
CREATE OR REPLACE FUNCTION public.is_teacher()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the calling user has the 'teacher' role
  -- We access user_roles directly. Since this is SECURITY DEFINER, 
  -- it runs with the privileges of the function creator (admin), ignoring RLS.
  RETURN EXISTS (
    SELECT 1 
    FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'teacher'
  );
END;
$$;

-- RLS Policies for User Roles (Updated to avoid recursion)
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own role" ON public.user_roles;
CREATE POLICY "Users can view their own role"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Teachers can view all roles" ON public.user_roles;
CREATE POLICY "Teachers can view all roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (public.is_teacher());


-- RLS Policies for Profiles (Updated to use the function)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Teachers can view all profiles" ON public.profiles;
CREATE POLICY "Teachers can view all profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (public.is_teacher());
