-- Note: These are dummy accounts for testing purposes
-- In a real application, you would create these through the signup process

-- The actual user creation needs to be done through Supabase Auth
-- But we can prepare the user metadata and related data

-- Insert dummy solutions for the provider account
-- Assuming provider email: provider@test.com
INSERT INTO solutions (
  company_name,
  solution_title,
  industries,
  company_sizes,
  budget_ranges,
  description,
  contact_email
) VALUES 
(
  'TechFlow Solutions',
  'AI-Powered Workflow Automation',
  ARRAY['Tech', 'SaaS'],
  ARRAY['51-200', '201-1000'],
  ARRAY['$25k-$50k', '$50k-$100k'],
  'Streamline your business processes with our intelligent automation platform. Reduce manual work by 80% and increase productivity across all departments.',
  'provider@test.com'
),
(
  'TechFlow Solutions',
  'Cloud Infrastructure Management',
  ARRAY['Tech', 'Finance'],
  ARRAY['201-1000', '1000+'],
  ARRAY['$50k-$100k', '$100k+'],
  'Complete cloud infrastructure management with 24/7 monitoring, automated scaling, and enterprise-grade security.',
  'provider@test.com'
),
(
  'TechFlow Solutions',
  'Data Analytics Dashboard',
  ARRAY['Retail', 'Healthcare'],
  ARRAY['11-50', '51-200'],
  ARRAY['$10k-$25k', '$25k-$50k'],
  'Transform your raw data into actionable insights with our intuitive analytics platform. Real-time reporting and predictive analytics included.',
  'provider@test.com'
);

-- Insert dummy survey responses for the seeker account
-- Assuming seeker email: seeker@test.com and user_id will be set after account creation
INSERT INTO survey_responses (
  session_id,
  user_id,
  answers
) VALUES 
(
  'dummy-session-1',
  NULL, -- This will need to be updated with actual user_id after account creation
  '{
    "company_size": "51-200",
    "industry": "Tech",
    "problem_area": "Customer support automation",
    "urgent_need": true,
    "budget": "$25k-$50k"
  }'::jsonb
),
(
  'dummy-session-2',
  NULL, -- This will need to be updated with actual user_id after account creation
  '{
    "company_size": "11-50",
    "industry": "Retail",
    "problem_area": "Inventory management system",
    "urgent_need": false,
    "budget": "$10k-$25k"
  }'::jsonb
);

-- Note: To complete the dummy account setup:
-- 1. Go to /auth and create these accounts:
--    - Email: provider@test.com, Password: provider123, Role: Solution Provider
--    - Email: seeker@test.com, Password: seeker123, Role: Solution Seeker
-- 2. After creating the seeker account, update the survey_responses table with the actual user_id
