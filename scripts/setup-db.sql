-- Create the solutions table
CREATE TABLE IF NOT EXISTS solutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name TEXT NOT NULL,
    solution_title TEXT NOT NULL,
    industries TEXT[] NOT NULL,
    company_sizes TEXT[] NOT NULL,
    budget_ranges TEXT[] NOT NULL,
    description TEXT,
    contact_email TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create the survey_responses table
CREATE TABLE IF NOT EXISTS survey_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT,
    user_id UUID,
    answers JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Optional: Add a foreign key constraint if you have a users table
-- ALTER TABLE survey_responses
-- ADD CONSTRAINT fk_user
-- FOREIGN KEY (user_id)
-- REFERENCES auth.users (id)
-- ON DELETE SET NULL;

-- Enable Row Level Security (RLS) for both tables
ALTER TABLE solutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (for reading solutions)
CREATE POLICY "Allow public read access to solutions"
ON solutions
FOR SELECT
USING (true);

-- Create policies for authenticated users (for submitting solutions)
CREATE POLICY "Allow authenticated users to insert their own solutions"
ON solutions
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Create policies for survey responses
CREATE POLICY "Allow anonymous users to insert survey responses"
ON survey_responses
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow users to view their own survey responses"
ON survey_responses
FOR SELECT
USING (auth.uid() = user_id);
