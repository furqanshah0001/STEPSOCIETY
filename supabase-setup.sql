-- Save this SQL to your Supabase SQL Editor and hit "Run"

-- 1. Create the `shoes` table to store vault items
CREATE TABLE IF NOT EXISTS public.shoes (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    price NUMERIC NOT NULL,
    "purchaseDate" TEXT NOT NULL,
    tags JSONB NOT NULL DEFAULT '[]'::jsonb,
    "wearCount" INTEGER DEFAULT 0,
    image TEXT NOT NULL,
    "createdAt" TEXT NOT NULL,
    verified BOOLEAN DEFAULT false,
    "societyOrderNumber" TEXT,
    condition INTEGER,
    "lastCleaned" TEXT,
    "cleaningNotes" TEXT,
    is_public BOOLEAN DEFAULT false,
    owner_name TEXT
);

-- Ensure new columns are added if the table already existed
ALTER TABLE public.shoes ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false;
ALTER TABLE public.shoes ADD COLUMN IF NOT EXISTS owner_name TEXT;

-- 2. Turn on Row Level Security (RLS)
ALTER TABLE public.shoes ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.shoe_likes (
    shoe_id UUID REFERENCES public.shoes(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    PRIMARY KEY (shoe_id, user_id)
);

ALTER TABLE public.shoe_likes ENABLE ROW LEVEL SECURITY;

-- 3. Create policies so users can only see mapping to their own user id
-- Policy for users to select their own shoes
DROP POLICY IF EXISTS "Users can view their own shoes" ON public.shoes;
CREATE POLICY "Users can view their own shoes" 
ON public.shoes FOR SELECT 
USING (auth.uid() = user_id);

-- Policy for ANYONE to view public shoes
DROP POLICY IF EXISTS "Anyone can view public shoes" ON public.shoes;
CREATE POLICY "Anyone can view public shoes" 
ON public.shoes FOR SELECT 
USING (is_public = true);

-- Policy for users to insert their own shoes
DROP POLICY IF EXISTS "Users can insert their own shoes" ON public.shoes;
CREATE POLICY "Users can insert their own shoes" 
ON public.shoes FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own shoes
DROP POLICY IF EXISTS "Users can update their own shoes" ON public.shoes;
CREATE POLICY "Users can update their own shoes" 
ON public.shoes FOR UPDATE 
USING (auth.uid() = user_id);

-- Policy for users to delete their own shoes
DROP POLICY IF EXISTS "Users can delete their own shoes" ON public.shoes;
CREATE POLICY "Users can delete their own shoes" 
ON public.shoes FOR DELETE 
USING (auth.uid() = user_id);

-- Policies for shoe_likes
DROP POLICY IF EXISTS "Anyone can view likes" ON public.shoe_likes;
CREATE POLICY "Anyone can view likes"
ON public.shoe_likes FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Users can insert their own likes" ON public.shoe_likes;
CREATE POLICY "Users can insert their own likes"
ON public.shoe_likes FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own likes" ON public.shoe_likes;
CREATE POLICY "Users can delete their own likes"
ON public.shoe_likes FOR DELETE
USING (auth.uid() = user_id);

