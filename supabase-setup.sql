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
    "cleaningNotes" TEXT
);

-- 2. Turn on Row Level Security (RLS)
ALTER TABLE public.shoes ENABLE ROW LEVEL SECURITY;

-- 3. Create policies so users can only see mapping to their own user id
-- Policy for users to select their own shoes
CREATE POLICY "Users can view their own shoes" 
ON public.shoes FOR SELECT 
USING (auth.uid() = user_id);

-- Policy for users to insert their own shoes
CREATE POLICY "Users can insert their own shoes" 
ON public.shoes FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own shoes
CREATE POLICY "Users can update their own shoes" 
ON public.shoes FOR UPDATE 
USING (auth.uid() = user_id);

-- Policy for users to delete their own shoes
CREATE POLICY "Users can delete their own shoes" 
ON public.shoes FOR DELETE 
USING (auth.uid() = user_id);
