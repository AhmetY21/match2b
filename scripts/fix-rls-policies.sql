-- Drop existing policies
DROP POLICY IF EXISTS "Allow authenticated users to insert their own solutions" ON solutions;
DROP POLICY IF EXISTS "Allow public read access to solutions" ON solutions;

-- Create new policies that work with our authentication system
CREATE POLICY "Allow public read access to solutions"
ON solutions
FOR SELECT
USING (true);

-- Allow authenticated users to insert solutions
CREATE POLICY "Allow authenticated users to insert solutions"
ON solutions
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Allow users to update their own solutions (based on contact email)
CREATE POLICY "Allow users to update their own solutions"
ON solutions
FOR UPDATE
USING (auth.email() = contact_email)
WITH CHECK (auth.email() = contact_email);

-- Allow users to delete their own solutions (based on contact email)
CREATE POLICY "Allow users to delete their own solutions"
ON solutions
FOR DELETE
USING (auth.email() = contact_email);

-- Also ensure the survey_responses policies are correct
DROP POLICY IF EXISTS "Allow anonymous users to insert survey responses" ON survey_responses;
DROP POLICY IF EXISTS "Allow users to view their own survey responses" ON survey_responses;

-- Allow anyone to insert survey responses (for anonymous surveys)
CREATE POLICY "Allow insert survey responses"
ON survey_responses
FOR INSERT
WITH CHECK (true);

-- Allow users to view their own survey responses
CREATE POLICY "Allow users to view their own survey responses"
ON survey_responses
FOR SELECT
USING (auth.uid() = user_id OR user_id IS NULL);
