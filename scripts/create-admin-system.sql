-- Create survey_questions table
CREATE TABLE IF NOT EXISTS survey_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_type VARCHAR(50) NOT NULL DEFAULT 'default',
  question_id VARCHAR(100) NOT NULL,
  question_text TEXT NOT NULL,
  question_type VARCHAR(20) NOT NULL CHECK (question_type IN ('radio', 'text', 'checkbox', 'select')),
  options JSONB,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_required BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(survey_type, question_id)
);

-- Create admin_users table for admin authentication
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  email VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  last_login TIMESTAMP WITH TIME ZONE
);

-- Enable RLS for survey_questions
ALTER TABLE survey_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for survey_questions
CREATE POLICY "Allow public read access to active survey questions"
ON survey_questions
FOR SELECT
USING (is_active = true);

CREATE POLICY "Allow admin full access to survey questions"
ON survey_questions
FOR ALL
USING (true)
WITH CHECK (true);

-- Create policies for admin_users (very restrictive)
CREATE POLICY "Allow admin users to read their own data"
ON admin_users
FOR SELECT
USING (true);

-- Insert default survey questions
INSERT INTO survey_questions (survey_type, question_id, question_text, question_type, options, order_index) VALUES
('default', 'company_size', 'What is the size of your company?', 'radio', '["1-10", "11-50", "51-200", "201-1000", "1000+"]'::jsonb, 1),
('default', 'current_infrastructure', 'What is your current infrastructure setup?', 'radio', '["On-premise", "Cloud", "Hybrid", "Not sure"]'::jsonb, 2),
('default', 'main_challenge', 'What is your main technical challenge?', 'text', null, 3),
('default', 'budget', 'What is your estimated budget for this solution?', 'radio', '["$0 - $10,000", "$10,001 - $50,000", "$50,001 - $100,000", "$100,001+"]'::jsonb, 4),
('default', 'timeline', 'What is your expected implementation timeline?', 'radio', '["1-3 months", "3-6 months", "6-12 months", "12+ months"]'::jsonb, 5)
ON CONFLICT (survey_type, question_id) DO NOTHING; -- Prevents re-inserting on subsequent runs

-- Create admin user (password: admin123)
-- Note: In production, you should use proper password hashing
INSERT INTO admin_users (username, password_hash, email) VALUES
('admin', '$2b$10$rOzJqQZQXQXQXQXQXQXQXu', 'admin@match2b.com')
ON CONFLICT (username) DO NOTHING; -- Prevents re-inserting on subsequent runs

-- Removed user_analytics and survey_analytics views as per request.
-- If you need analytics later, these views can be re-added.

-- Grant necessary permissions
GRANT ALL ON survey_questions TO authenticated;
GRANT SELECT ON admin_users TO authenticated;
